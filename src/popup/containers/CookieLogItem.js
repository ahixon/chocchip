import React from 'react';
import { connect } from 'react-redux';

import TableExpandable from '../components/Expandable';

const mapStateToProps = state => {
  return {
    cookieLog: state.cookieLog.cookieLogByDomain
  }
};

@connect(mapStateToProps)
export default class CookieLogItem extends React.Component {
  render() {
    const log = this.props.cookieLog[this.props.domain][this.props.name];
    const first = log.cookies[0];

    const type = log.cookies.reduce((acc, cookie) => {
      if (acc == undefined) {
        return cookie.isSession ? 'session' : 'expires'
      } else {
        if (acc == 'session' && !cookie.isSession) {
          return 'mixed'
        } else if (acc == 'expires' && cookie.isSession) {
          return 'mixed';
        }
      }

      return acc;
    }, undefined);

    const expanded = <pre>{ first.value }</pre>;
    return (<TableExpandable expandTo={ expanded }>
              <td>{type}</td>
              <td>{first.name}</td>
              <td>{first.displayDomain()}</td>
            </TableExpandable>);
  }
}
