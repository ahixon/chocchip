const cookieListener = function (details) {
  chrome.cookies.getAllCookieStores(function (cookieStores) {
    for (const store of cookieStores) {
      if (store.id == details.cookie.storeId) {
        // notify all the tabs that share this cookie store
        for (const tabId of store.tabIds) {
          const tabHistory = getTabHistory(tabId);
          
          tabHistory.addToHistory({
            type: 'cookieChanged',
            source: 'store',
            cookie: details.cookie,
            cause: details.cause,
            time: new Date()
          });
        }
      }
    }
  });
}

export default cookieListener;