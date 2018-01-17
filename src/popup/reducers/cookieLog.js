import { combineReducers } from 'redux';

const cookieHash = (cookie) => {
  const domain = cookie.displayDomain(false, '');
  const name = cookie.name;

  return domain + '; ' + name;
}

const cookieLog = (state = {
  cookies: [],
  policies: []
}, action) => {
  switch (action.type) {
    case 'ADD_COOKIE':
      return {
        ...state,
        cookies: [action.cookie].concat(state.cookies)
      };
    default:
      return state;
  }
};

const cookieLogByDomain = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COOKIE':
      const domain = action.cookie.displayDomain(false, '');

      const cookieDomain = state[domain];
      return {
        ...state,
        [domain]: {
          ...cookieDomain,
          [action.cookie.name]: cookieLog(cookieDomain ? cookieDomain[action.cookie.name] : undefined, action)
        }
      };
    default:
      return state;
  }
};

const order = (state = [], action) => {
  switch (action.type) {
    case 'ADD_COOKIE':
      const hash = cookieHash(action.cookie);

      // remove existing from list
      const oldIndex = state.indexOf(hash);
      let newOrder = state.slice();

      if (oldIndex != -1) {
        newOrder.splice(oldIndex, 1);
      }

      // append to head of list
      return [hash].concat(newOrder);
    default:
      return state;
  }
};

export default combineReducers({
  cookieLogByDomain,
  order  
});