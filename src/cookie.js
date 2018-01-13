const psl = require('psl');

class InvalidDomainError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

class InvalidURLError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

function validDomainSuffix(domain, suffix) {
  const suffixList = suffix.split('.');
  const domainList = domain.split('.');

  const suffixListLength = suffixList.length;
  const domainListLength = domainList.length;

  // walk back from suffixList, checking
  // that each element back from domainList is the same
  for (var i = 1; i <= suffixListLength; i++) {
    const suffixElem = suffixList[suffixListLength - i];
    const domainElem = domainList[domainListLength - i];

    if (!suffixElem || !domainElem) {
      return false;
    }

    if (suffixElem.toLowerCase() !== domainElem.toLowerCase()) {
      return false;
    }
  }

  return true;
}

class Cookie {
  constructor(name, value, attributes, url, source) {
    this.name = name;
    this.value = value;

    // TODO: intercept access to attributes, and check
    // that any modifications to `domain` are valid domains
    this.attributes = attributes || new Map();
    this.url = url;

    // TODO: check that domain is valid on construction

    this.source = source;
  }

  /**
   * Returns the normalised version of the cookie's Domain property.
   * 
   * That is, the cookie's Domain value without a leading '.'.
   *
   * If no Domain property was set, it returns null. It does
   * *not* consider the requested URL
   *
   * You should not use this to determine whether or not a cookie
   * applies to a given request -- use {@link Cookie#appliesTo} instead.
   *
   */
  get normalisedCookieDomain() {
    if (!this.attributes.has('domain')) {
      return null;
    }

    const originalCookieDomain = this.attributes.get('domain');
    let cookieDomain = originalCookieDomain;

    if (cookieDomain.startsWith('.')) {
      cookieDomain = cookieDomain.substr(1);
    }

    if (cookieDomain.startsWith('.')) {
      throw new InvalidDomainError('cookie domain ' + originalCookieDomain +
                                   ' has multiple . prefixes');
    }

    return cookieDomain;
  }

  /**
   * Returns a standardised version of the cookie's Domain
   * to display to users.
   *
   * It will return the exactly the domain if it is meant to
   * match only that host, or prefixed with '*.' if it is
   * allowed to match that domain, and any subdomains.
   */ 
  displayDomain(internetExplorer = false) {
    
  }

  /**
   * Returns the complete SLD + TLD based on the original request URL.
   */
  get requestDomain() {
    const reqHostname = getHostname(this.url);
    if (!reqHostname) {
      throw new InvalidURLError("no hostname for " + this.url);
    }

    if (!psl.isValid(reqHostname)) {
      throw new InvalidURLError("hostname " + reqHostname +
                                " is not in known public suffix list");
    }

    const parsed = psl.parse(reqHostname);
    return parsed.subdomain + parsed.domain;
  }

  /**
   * Returns whether or not a cookie applies to a given
   * request hostname.
   *
   * @param {Boolean} internetExplorer [false] - Use non-standard Internet
   *    Explorer cookie matching behaviour.
   */
  appliesTo(testDomain, internetExplorer = false) {
    const parsedRequestDomain = psl.parse(this.url);
    const parsedRequestDomainValid = psl.isValid(domain);

    let cookieDomain = this.normalisedCookieDomain;

    if (internetExplorer) {
      if (!cookieDomain) {
        // if no cookie domain was provided, IE assumes
        // the cookie domain was the hostname of the requested URL

        // FIXME: is this the SLD + TLD of the URL, or the full hostname?
        // for now, assume the latter (the former seems slightly insane?)
        cookieDomain = this.requestDomain;
      }
    }

    if (cookieDomain) {
      // the test domain should be a suffix of the cookie domain
      return validDomainSuffix(testDomain, cookieDomain);
    } else {
      // only to origin server, so domain must match exactly
      return testDomain === cookieDomain;
    }
  }

  static fromSetCookieHeader(header, current_uri) {
    const tags = Array.from(header_value.split(';'));
    let tags_kvArray = tags.map(tag => tag.split('=', 2));

    // remove the first item since it's the kv for the cookie itself
    const cookie_kv = tags_kvArray.splice(0, 1)[0];

    const name = cookie_kv[0];
    const value = cookie_kv[1];

    // remainder are properties
    let attributes = new Map();

    for (const tag_kv of tags_kvArray) {
      attributes.set(tag_kv[0].trim().toLowerCase(), tag_kv[1]);
    }

    // TODO: handle path attribute by extracting directory from uri
    // http://tools.ietf.org/html/rfc6265#section-4.1.2.4

    return new HeaderCookie(cookie_domain, name, value, attributes);
  }
}

export { validDomainSuffix, Cookie };