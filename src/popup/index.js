import { h, render } from 'preact';
import configureStore from './store.js';

import './style.css';

const store = configureStore({ counter: 0 });

function renderRoot() {
  let App = require('./containers/App');
  App = App.default || App;

  document.rootElem = render(<App store={store} />,
                             document.body, document.rootElem);
}

// do the initial render
renderRoot();

if (module.hot) {
  // support react developer tools via preact
  require('preact/debug');

  module.hot.accept();
  module.hot.accept('./containers/App', renderRoot);
}