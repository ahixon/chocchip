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

    return (<React.Fragment>
            <tr className='expandable-row' onClick={this.toggleExpand.bind(this)}>
              <td className={'expandable-opener ' + (open ? 'open' : 'closed') }></td>
              {this.props.children}
            </tr>

            <tr className='expandable-content' style={{'display': !open ? 'none' : ''}}>
              <td colspan={this.props.children.length + 1}>{ expandTo }</td>
            </tr>
            </React.Fragment>);
  }
}
