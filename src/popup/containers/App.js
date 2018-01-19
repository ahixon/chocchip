import React from 'react';
import TabPopup from './TabPopup';
import { Provider } from 'react-redux';

export default class App extends React.Component {
  render() {
    return (<Provider store={this.props.store}><TabPopup /></Provider>);
  }
}