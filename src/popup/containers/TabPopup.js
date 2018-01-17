import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import CookieLogItem from './CookieLogItem';

const mapStateToProps = state => {
  return {
    log: state.cookieLog
  }
};

@connect(mapStateToProps)
export default class TabPopup extends Component {
  render({ log }) {
    const histories = log.order.map(domainNamePair => {
      const [domain, name] = domainNamePair.split('; ', 2);
      return (<CookieLogItem domain={domain} name={name} />);
    });

    return (<table>{ histories }</table>);
  }
}