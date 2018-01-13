import { TabHistory } from '../cookies.js'

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

export { getTabHistory };