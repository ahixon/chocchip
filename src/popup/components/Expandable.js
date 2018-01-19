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
            <tr>
              <td>
                <a className='row'
                   onClick={this.toggleExpand.bind(this)}
                   href='#'>{!open ? '>' : 'v' }
                </a>
              </td>

              {this.props.children}
            </tr>

            <tr className='expandable' style={{'display': !open ? 'none' : ''}}>
              <td colspan={this.props.children.length + 1}>{ expandTo }</td>
            </tr>
            </React.Fragment>);
  }
}
