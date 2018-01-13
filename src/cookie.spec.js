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
    describe('#appliesTo', () => {
      it('Domain -> all subdomains', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");

        expect(cookie.appliesTo("domain.com"), 'root domain').to.be.true;
        expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.true;
        expect(cookie.appliesTo("otherdomain.com"), 'other domain').to.be.false;
      });

      it('Domain with . prefix -> subdomains ', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");

        expect(cookie.appliesTo("domain.com"), 'root domain').to.be.true;
        expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.true;
        expect(cookie.appliesTo("otherdomain.com"), 'other domain').to.be.false;
      });

      it('Domain cannot apply to different domain', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");
        expect(cookie.appliesTo("xdomain.com")).to.be.false;
      });

      it('exactly on the hostname if no Domain is set', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1", 'http://www.domain.com/');
        expect(cookie.appliesTo("xdomain.com"), 'other domain').to.be.false;
        expect(cookie.appliesTo("domain.com"), 'root domain').to.be.false;
        expect(cookie.appliesTo("sub.domain.com"), 'subdomain').to.be.false;
        expect(cookie.appliesTo("www.domain.com"), 'url hostname').to.be.true;
      });

      it('domain + subdomains if no Domain and we are IE', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1", 'http://www.domain.com/');
        expect(cookie.appliesTo("xdomain.com", true), 'other domain').to.be.false;
        expect(cookie.appliesTo("domain.com", true), 'root domain').to.be.false;
        expect(cookie.appliesTo("sub.www.domain.com", true), 'subdomain').to.be.true;
        expect(cookie.appliesTo("www.domain.com", true), 'url hostname').to.be.true;
      });
    });

    describe('normalises the cookie domain', () => {
      it('for Domains without a . prefix', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=domain.com");
        expect(cookie.normalisedCookieDomain).to.equal('domain.com');
      });

      it('for Domains with a . prefix', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");
        expect(cookie.normalisedCookieDomain).to.equal('domain.com');
      });
    });

    describe('displayDomain', () => {
      it('prefixes wildcard for Domain cookies', () => {
        const cookie = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");
        const cookie_dot = Cookie.fromSetCookieHeader("a=1; Domain=.domain.com");

        expect(cookie_dot.displayDomain()).to.equal('*.domain.com')
        expect(cookie.displayDomain()).to.equal('*.domain.com')
      });

      it('returns request domain for non-Domain cookies', () => {
        const cookie_www = Cookie.fromSetCookieHeader("a=1", "http://www.domain.com/");
        expect(cookie_www.displayDomain()).to.equal('www.domain.com')

        const cookie = Cookie.fromSetCookieHeader("a=1", "http://domain.com/");
        expect(cookie.displayDomain()).to.equal('domain.com')
      });

      it('prefixes wildcard for non-Domain when we are IE', () => {
        const cookie_www = Cookie.fromSetCookieHeader("a=1", "http://www.domain.com/");
        expect(cookie_www.displayDomain(true)).to.equal('*.www.domain.com')

        const cookie = Cookie.fromSetCookieHeader("a=1", "http://domain.com/");
        expect(cookie.displayDomain(true)).to.equal('*.domain.com')
      });
    });
  });
});
