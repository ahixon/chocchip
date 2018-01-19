import React from 'react';
import { connect } from 'react-redux';

import CookieLogItem from './CookieLogItem';

const mapStateToProps = state => {
  return {
    log: state.cookieLog
  }
};

@connect(mapStateToProps)
export default class TabPopup extends React.Component {
  render() {
    const histories = this.props.log.order.map(domainNamePair => {
      const [domain, name] = domainNamePair.split('; ', 2);
      return (<CookieLogItem key={domainNamePair} domain={domain} name={name} />);
    });

    return (<table className='history'>{ histories }</table>);
  }
}