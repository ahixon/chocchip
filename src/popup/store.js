import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

const storeMiddleware = [];

export default function configureStore(initialState) {
  let storeEnhancer = applyMiddleware(...storeMiddleware);

  if (module.hot) {
    // apply the remote redux devtools middleware
    // note: must be top-level enhancer
    const remoteReduxDevtools = require('remote-redux-devtools');
    const debugEnhancer = remoteReduxDevtools.composeWithDevTools({
      hostname: process.env.DEV_SETTINGS.reduxDevtoolHost,
      port: process.env.DEV_SETTINGS.reduxDevtoolPort,
      name: 'popup',
    });

    storeEnhancer = debugEnhancer(storeEnhancer);
  }

  const store = createStore(rootReducer, initialState, storeEnhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}