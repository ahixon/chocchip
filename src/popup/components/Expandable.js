import React from 'react';

export default class TableExpandable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open || false
    };
  }

  toggleExpand() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { disabled, expandTo, children } = this.props;
    const { open } = this.state;

    return (<div className='expandable'>
      <a className='row' onClick={this.toggleExpand.bind(this)} href='#'>
        <div className='col toggle'>{!open ? '>' : 'v' }</div>
        { children }
      </a>
      <div className='fullcol' style={{'display': !open ? 'none' : ''}}>
        { expandTo }
      </div>
    </div>);
  }
}
