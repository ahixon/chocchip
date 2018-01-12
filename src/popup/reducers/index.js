import { createStore } from 'redux';

const incrementCounter = (state) => {
  return {
    counter: state.counter + 1
  };
}

const ACTIONS = {'INCREMENT_COUNTER': incrementCounter};

const storeReducer = (state, action) => {
  if (action && action.type && ACTIONS[action.type]) {
    return ACTIONS[action.type](state, action)
  }

  return state;
}

const INITIAL_STORE = {counter: 0};

export default (enhancer) =>
  createStore(storeReducer, INITIAL_STORE, enhancer);
