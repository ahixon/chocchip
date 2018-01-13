class TabHistory extends EventEmitter {
  constructor(tabId) {
    super();

    this.tabId = tabId;
    this.sentCookies = new Map();
    this.receivedCookies = new Map();

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

  setCookie(cookie, direction, time, initiator) {
    this.receivedCookies.set(cookie.name, cookie);

    this.addToHistory({
      type: 'cookieChanged',
      source: direction,
      cookie: cookie,
      time: time || new Date(),
      initiator: initiator
    });

    this.emit('set', cookie);
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