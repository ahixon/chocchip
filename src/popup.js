import { h, render } from 'preact';

import { Provider } from 'preact-redux';

import createStore from './popup/reducers';
import TabPopup from './popup/components/TabPopup';

import './popup/style.css';

const store = createStore();

var rootElem;
const renderRootElem = () => {
  const app = (<Provider store={store}>
                 <TabPopup />
               </Provider>);
  rootElem = render(app, document.body, rootElem);
}

renderRootElem();

if (module.hot) {
  require('preact/debug');
  module.hot.accept('./popup.js', renderRootElem);
}