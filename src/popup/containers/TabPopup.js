import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { incrementCounter } from '../actions';

const mapStateToProps = state => {
  return {
    counter: state.counter
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCounterAdd: () => {
      dispatch(incrementCounter());
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TabPopup extends Component {
  render({ counter, onCounterAdd }) {
    return (<div>
            <p>Hello world! Counter is: { counter }</p>
            <button onClick={onCounterAdd}>Add</button>
            </div>);
  }
}
