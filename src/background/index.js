import responseHeaderListener from './responseHeaders';
import navigationListener from './navigation';

import { getTabHistory } from './utils';

// log all cookies being received from server
chrome.webRequest.onHeadersReceived.addListener(responseHeaderListener,
  { urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);

// send notifications each time the location changes significantly
// so that we can group cookie events
chrome.webNavigation.onCommitted.addListener(navigationListener);

// send notifications to each tab popup for each changed cookie
// chrome.cookies.onChanged.addListener(cookieListener);

// listen for connections from a popup
// and send any cookie updates out to it
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.type == 'sync') {
      const tabHistory = getTabHistory(msg.tabId);

      tabHistory.port = port;

      for (const msg of tabHistory.messages) {
        port.postMessage(msg);
      }

      port.onDisconnect.addListener(function() {
        tabHistory.port = null;
      });
    }
  });
});

if (module.hot) {
  module.hot.accept();
}