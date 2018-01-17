import { createStore, combineReducers } from 'redux';
import policies from './policies';
import cookieLog from './cookieLog';

const filter = (state = '', action) => {
  return state;
}

export default combineReducers({
  policies,
  cookieLog,
  filter,
});
