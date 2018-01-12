import { HeaderCookie, NormalisedHeaders, TabHistory, getDomain } from './cookies.js'

var tabHistories = new Map();

function getTabHistory(tabId) {
  if (tabHistories.has(tabId)) {
    return tabHistories.get(tabId);
  }

  const newHistory = new TabHistory();
  tabHistories.set(tabId, newHistory);
  return newHistory;
}

// NOTE: initiator might be null when we haven't commited the
// navigation change yet

// FIXME: want to get TLD
// var getCookieHost = getDomain;

// log all cookies being sent to server
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function(details) {
//     if (details.tabId == -1) {
//       // request not related to tab, ignore
//       return;
//     }

//     const tabHistory = getTabHistory(details.tabId);
//     const headers = new NormalisedHeaders(details.requestHeaders);

//     for (const [headerName, headerValue] of headers.entries()) {
//       if (headerName != 'cookie') {
//         continue;
//       }

//       // parse it from the header
//       let cookie = HeaderCookie.fromString(headerValue, details.url);
//       tabHistory.setCookie(cookie, 'client', new Date(details.timeStamp), 
//                            getCookieHost(details.initiator ? details.initiator : details.url));
//     }

//     // return { requestHeaders: headers };
//   },
  
//   { urls: ["<all_urls>"]},
//   ["blocking", "requestHeaders"]);

// log all cookies being received from server
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    if (details.tabId == -1) {
      // request not related to tab, ignore
      return;
    }

    const tabHistory = getTabHistory(details.tabId);
    const headers = new NormalisedHeaders(details.responseHeaders);

    // log the cookies we got
    for (const [headerName, headerValue] of headers.entries()) {
      if (headerName != 'set-cookie') {
        continue;
      }

      // parse it from the header
      let cookie = HeaderCookie.fromString(headerValue, details.url);

      // keep it for this tab
      tabHistory.setCookie(cookie, 'server', new Date(details.timeStamp), details.url);
    }

    // return { responseHeaders: headers };
  },

  { urls: ["<all_urls>"]},
  ["blocking", "responseHeaders"]);


// send a notification on each commited page change
const NOTIFY_TRANSITIONS_ALWAYS = [
  'typed',
  'generated',
  'keyword',
  'keyword_generated',
  'auto_bookmark',
  //'manual_subframe'
  'start_page'
];

const NOTIFY_TRANSITIONS_DIFFERENT_DOMAIN = [
  'link'
];

// send notifications each time the location changes significantly
// so that we can group cookie events
chrome.webNavigation.onCommitted.addListener(function (details) {
  const tabHistory = getTabHistory(details.tabId);

  const historyObject = {
    type: 'navigation',
    url: details.url,
    domain: getDomain(details.url),
    time: new Date(),
    transitionType: details.transitionType
  };

  if (NOTIFY_TRANSITIONS_ALWAYS.indexOf(details.transitionType) != -1) {
    tabHistory.addToHistory(historyObject);
  } else if (NOTIFY_TRANSITIONS_DIFFERENT_DOMAIN.indexOf(details.transitionType) != -1) {
    if (getDomain(tabHistory.lastUrl) != getDomain(details.url)) {
      tabHistory.addToHistory(historyObject);
    }  
  }

  tabHistory.lastUrl = details.url;
});

// send notifications to each tab popup for each changed cookie
// chrome.cookies.onChanged.addListener(function (details) {
//   chrome.cookies.getAllCookieStores(function (cookieStores) {
//     for (const store of cookieStores) {
//       if (store.id == details.cookie.storeId) {
//         // notify all the tabs that share this cookie store
//         for (const tabId of store.tabIds) {
//           const tabHistory = getTabHistory(tabId);
          
//           tabHistory.addToHistory({
//             type: 'cookieChanged',
//             source: 'store',
//             cookie: details.cookie,
//             cause: details.cause,
//             time: new Date()
//           });
//         }
//       }
//     }
//   });
// });

window.addEventListener('load', function() {
  // listen for connections from a popup
  // and send any cookie updates out to it
  chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(msg) {
      if (msg.type == 'sync') {
        const tabHistory = getTabHistory(msg.tabId);

        tabHistory.port = port;

        // send all previous messages back
        // console.log('connected');

        for (const msg of tabHistory.messages) {
          port.postMessage(msg);
        }

        // chrome.cookies.getAll({ url: msg.url }, function(cookies) {
        //   for (const cookie of cookies) {
        //     port.postMessage({type: 'new', source: 'store', cookie: cookie});
        //   }
        // });

        port.onDisconnect.addListener(function() {
          tabHistory.port = null;
        });
      }
    });
  });
});