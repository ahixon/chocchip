import { getDomain } from '../cookies.js'
import { getTabHistory } from './tabhistory';

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

const navigationListener = function (details) {
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
}

export default navigationListener;