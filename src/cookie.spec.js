import { validDomainSuffix, Cookie } from './cookie.js';
const expect = require('chai').expect;

describe('Cookie handling', () => {
  describe('#validDomainSuffix()', () => {
    it('should not match empty suffix or domains', () => {
      expect(validDomainSuffix("", "")).to.be.false;
      expect(validDomainSuffix(".", "")).to.be.false;
      expect(validDomainSuffix("", ".")).to.be.false;
    });

    it('should not match invalid suffixes or domains', () => {
      expect(validDomainSuffix(".", ".")).to.be.false;
      expect(validDomainSuffix("a.a", "a.")).to.be.false;

      expect(validDomainSuffix("a.a", "a.")).to.be.false;
      expect(validDomainSuffix(".", "a.")).to.be.false;
      expect(validDomainSuffix(".a", "a.")).to.be.false;
      expect(validDomainSuffix(".", ".a")).to.be.false;
      expect(validDomainSuffix(".", "a")).to.be.false;
      expect(validDomainSuffix("a.", "a")).to.be.false;
    });

    it('should match TLD com to same suffix', () => {
      expect(validDomainSuffix("com", "com")).to.be.true; 
    });
    
    it('should perform domain matching case-insensitively', () => {
      expect(validDomainSuffix("com", "COM")).to.be.true;
    });
    
    it('should match second level domains', () => {
      expect(validDomainSuffix("domain.com", "com")).to.be.true;
    });

    it('should not match suffix with dot prefix (invalid)', () => {
      expect(validDomainSuffix("domain.com", ".com")).to.be.false;
    });

    it('should match all allowable prefixes for a domain', () => {
      expect(validDomainSuffix("test.domain.com", "com")).to.be.true;
      expect(validDomainSuffix("test.domain.com", "domain.com")).to.be.true;
      expect(validDomainSuffix("test.domain.com", "test.domain.com")).to.be.true;
    });

    it('should not match suffix that is more specific than domain', () => {
      expect(validDomainSuffix("test.domain.com", "sub.test.domain.com")).to.be.false;
    });
  });
  
  describe('Cookie', () => {
    it('applies to cookies matching a Domain and subdomains', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");

      expect(cookie.appliesTo("domain.com"), 'root domain').to.be.true;
      expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.true;
      expect(cookie.appliesTo("otherdomain.com"), 'other domain').to.be.false;
    });

    it('applies to cookies matching a Domain with . prefix and subdomains ', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");

      expect(cookie.appliesTo("domain.com"), 'root domain').to.be.true;
      expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.true;
      expect(cookie.appliesTo("otherdomain.com"), 'other domain').to.be.false;
    });

    it('does not apply to cookies with a different host', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");
      expect(cookie.appliesTo("xdomain.com")).to.be.false;
    });

    it('only applies to cookies exactly on the hostname if no Domain is set', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1", 'http://www.domain.com/');
      expect(cookie.appliesTo("xdomain.com"), 'other domain').to.be.false;
      expect(cookie.appliesTo("domain.com"), 'root domain').to.be.false;
      expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.false;
      expect(cookie.appliesTo("www.domain.com"), 'url hostname').to.be.true;
    });

    it('applies to domain and subdomains if no Domain is set and we are IE', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1", 'http://www.domain.com/');
      expect(cookie.appliesTo("xdomain.com", true), 'other domain').to.be.false;
      expect(cookie.appliesTo("domain.com", true), 'root domain').to.be.false;
      expect(cookie.appliesTo("sub.www.domain.com", true), 'subdomain').to.be.true;
      expect(cookie.appliesTo("www.domain.com", true), 'url hostname').to.be.true;
    });

    it('normalises the domain for Domains without a . prefix', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");
      expect(cookie.normalisedCookieDomain).to.equal('domain.com');
    });

    it('normalises the domain for Domains with a . prefix', () => {
      const cookie = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");
      expect(cookie.normalisedCookieDomain).to.equal('domain.com');
    });
  });
});
