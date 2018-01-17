import { h, Component } from 'preact';
import { connect } from 'preact-redux';

const mapStateToProps = state => {
  return {
    cookieLog: state.cookieLog.cookieLogByDomain
  }
};

@connect(mapStateToProps)
export default class CookieLogItem extends Component {
  render({ cookieLog, domain, name }) {
    const log = cookieLog[domain][name];
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

    return (<tr>
      <td><span class='icon'>{ type }</span></td>
      <td><span>{ first.name }</span></td>
      <td><span>{ first.displayDomain() }</span></td>
      <td><span>{ first.value }</span></td>
    </tr>);
  }
}
