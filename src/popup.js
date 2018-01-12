import { h, render } from 'preact';

import { Provider } from 'preact-redux';
import { applyMiddleware } from 'redux';

import createStore from './popup/reducers';
import TabPopup from './popup/components/TabPopup';

import './popup/style.css';

const storeMiddleware = [];
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

// create the redux store
const store = createStore(storeEnhancer);

// (re)renders the app at a given element
var rootElem;
const renderRootElem = () => {
  const app = (<Provider store={store}>
                 <TabPopup />
               </Provider>);
  rootElem = render(app, document.body, rootElem);
}

// do the initial render
renderRootElem();

if (module.hot) {
  // re-render the root element and pass down any changes
  // if this module changes
  module.hot.accept('./popup.js', renderRootElem);
}

if (module.hot) {
  // support react developer tools via preact
  require('preact/debug');
}