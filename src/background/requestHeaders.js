
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