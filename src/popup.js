const psl = require('psl');
import { getDomain } from './cookies.js';

import './css/popup.css';

class DomainHistory {
  constructor(domain_name) {
    this.domain = domain_name;

    this.cookieOrdering = new Set();
    this.cookies = new Set();
  }

  render() {
    return `<h1>${this.domain}</h1>
    <div class='event-groups'>

      <div class='received-group'>
        <h2>Received</h2>
        <ul class='received'></ul>
      </div>

      <div class='sent-group'>
        <h2>Sent</h2>
        <ul class='sent'></ul>
      </div>
    </div>`;
  }
}

class EventManager {
  constructor(tabId, currentUrl) {
    this.EVENT_HANDLERS = {
      'navigation': this.handleNavigation,
      'cookieChanged': this.handleCookie
    };

    this.port = null;
    this.tabId = tabId;

    this.visitedDomains = new Map();
    this.domainOrdering = new Set();

    this.logNode = document.getElementById('eventlog');

    // create a section for the current url
    if (currentUrl) {
      this.findDomainHistory(getDomain(currentUrl));
    }
  }

  connect() {
    this.port = chrome.runtime.connect({name: "knockknock"});

    // handle incoming messages
    this.port.onMessage.addListener(this.onPortMessage.bind(this));

    // ask the background tab to forward us all the events so far
    this.port.postMessage({
      type: 'sync',
      tabId: this.tabId
    });
  }

  onPortMessage(message) {
    if (this.EVENT_HANDLERS.hasOwnProperty(message.type)) {
      return this.EVENT_HANDLERS[message.type].bind(this)(message);
    }

    console.error('unknown message type ' + message.type);
  }

  handleNavigation(msg) {
    this.findDomainHistory(msg.domain)
  }

  findDomainHistory(fullDomain) {
    let domainName = psl.get(fullDomain);
    let hist = null;

    if (this.domainOrdering.has(domainName)) {
      // re-insert to put it at the end
      this.domainOrdering.delete(domainName);
      this.domainOrdering.add(domainName);

      hist = this.visitedDomains.get(domainName);

      // remove old node's location in eventlog
      this.logNode.removeChild(hist.node);

      // and append to top
      this.logNode.insertBefore(hist.node, this.logNode.firstChild);
    } else {
      hist = new DomainHistory(domainName);

      this.visitedDomains.set(domainName, hist);
      this.domainOrdering.add(domainName);

      let div = document.createElement('div');
      div.classList.add('domainEvents');
      div.innerHTML = hist.render();

      // store internal node
      hist.node = div;

      // append to top
      this.logNode.insertBefore(div, this.logNode.firstChild);  
    }

    return hist;
  }

  handleCookie(msg) {
    let hist = this.findDomainHistory(msg.initiator);
    let domainName = psl.get(msg.initiator);

    if (msg.source != 'server') {
      // TODO: handle client side cookie modification
      return;
    }

    const elem = hist.node.getElementsByClassName(msg.source == 'server' ? 'received' : 'sent')[0];

    // new cookie
    let li = document.createElement('li');
    li.innerHTML = msg.cookie.name + ' = ' + msg.cookie.value;
    elem.appendChild(li);
  }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	let currTab = tabs[0];
	if (!currTab) {
		return;
	}

  const manager = new EventManager(currTab.id, currTab.url);
  manager.connect();
});

if (module.hot) {
  module.hot.accept('./popup.js', function() {
    console.log('Accepting the updated popup module!');
  })
}