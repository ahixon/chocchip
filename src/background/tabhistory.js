import { EventEmitter } from '../cookies.js';

class TabHistory extends EventEmitter {
  constructor(tabId) {
    super();

    this.tabId = tabId;

    this.messages = [];
    this.port = null;
    this.lastUrl = null;
  }

  addToHistory(message) {
    this.messages.push(message);

    if (this.port) {
      this.port.postMessage(message);
    }
  }

  setCookie(header, direction, time, url) {
    this.addToHistory({
      type: 'cookieChanged',
      source: direction,
      header: header,
      time: time || new Date(),
      url: url
    });

    // this.emit('set', cookie);
  }
}

if (!window.tabHistories) {
  window.tabHistories = new Map();
}

function getTabHistory(tabId) {
  if (tabHistories.has(tabId)) {
    return tabHistories.get(tabId);
  }

  const newHistory = new TabHistory();
  tabHistories.set(tabId, newHistory);
  return newHistory;
}

export { TabHistory, getTabHistory };