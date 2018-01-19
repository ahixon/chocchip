import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store.js';

import './style.css';

import { Cookie } from '../cookie.js';
import { addCookie } from './actions';

const store = configureStore();

function renderRoot() {
  let App = require('./containers/App');
  App = App.default || App;

  ReactDOM.render(<App store={store} />,
                  document.getElementById('root'));
}

// do the initial render
renderRoot();

if (module.hot) {
  module.hot.accept();
  module.hot.accept('./containers/App', renderRoot);
}

// kick off listening for events
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  const currTab = tabs[0];
  if (!currTab) {
    return;
  }

  const port = chrome.runtime.connect();

  // handle incoming messages
  port.onMessage.addListener((msg) => {
    if (msg.type != 'cookieChanged') {
      console.warn('bad message type', msg.type, 'ignoring');
      return;
    }

    store.dispatch(addCookie(Cookie.fromSetCookieHeader(msg.header, msg.url)));
  });

  // ask the background tab to forward us all the events so far
  port.postMessage({
    type: 'sync',
    tabId: currTab.id
  });
});