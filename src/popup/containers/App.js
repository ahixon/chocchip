import { h, Component } from 'preact';
import TabPopup from '../components/TabPopup';
import { Provider } from 'preact-redux';

export default class App extends Component {
  render({ store }) {
    return (<Provider store={store}><TabPopup /></Provider>);
  }  
}