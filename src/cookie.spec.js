import { validDomainSuffix } from './cookie.js';
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
  
  // describe('Cookie', () => {
  //   a = Cookie.fromSetCookieHeader("a=1; Host: domain.com");
  //   a.appliesTo("domain.com"), true
  //   a.appliesTo("sub.domain.com"), true
  //   a.appliesTo("xdomain.com"), false
  // }
});
