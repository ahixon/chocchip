import { HeaderCookie, NormalisedHeaders } from '../cookies.js'
import { getTabHistory } from './tabhistory';

const reponseHeaderListener = function(details) {
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
    // let cookie = HeaderCookie.fromString(headerValue, details.url);
    // TODO: check if matches any policies and apply them

    // keep it for this tab
    tabHistory.setCookie(headerValue, 'server', new Date(details.timeStamp), details.url);
  }

  // return { responseHeaders: headers };
};

export default reponseHeaderListener;