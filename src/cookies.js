var CookiePolicy = function(cookie_domain, path_pattern, name, expiry, attributes, expiryTime) {
  this.domain = cookie_domain;
  this.path_pattern = path_pattern;
  this.name = name;
  this.expiry = expiry;
  this.attributes = attributes;

  this.expiryTime = expiryTime || 0;
}

var PolicyManager = function() {
  // cookie domain name -> CookiePolicy
  this.policies = new Map();
};

PolicyManager.prototype.loadFromStorage = function() {
  chrome.storage.sync.get('policies', function(items) {
    this.policies = items.policies;
  })
}

PolicyManager.prototype.add = function(policy) {
  this.policies.set(policy.domain, policy);
  // TODO: sync storage?
}

function getDomain(uri) {
  uri = uri.split('/', 3);
  if (uri[1] != "") {
    return null;
  }

  const allowedProtocols = ["http:", "https:", "wss:", ""];

  if (allowedProtocols.indexOf(uri[0].toLowerCase()) == -1) {
    return null;
  }

  return uri[2];
}

class NormalisedHeaders {
  constructor(headers) {
    this.headers = new Map();

    for (var i = 0; i < headers.length; i++) {
      this.headers.set(headers[i].name.toLowerCase(), headers[i].value);
    }
  }

  get(header) {
    return this.headers.get(header);
  }

  [Symbol.iterator]() {
    return this.headers[Symbol.iterator]();
  }

  entries() {
    return this.headers.entries();
  }
}

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(label, cb) {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(cb);
  }

  removeListener(label, cb) {
    if (!this.listeners.has(label)) {
      return false;
    }

    const listenersForLabel = this.listeners.get(label);
    const listenerIdx = listenersForLabel.indexOf(cb);
    if (listenerIdx == -1) {
      return false;
    }

    listenersForLabel.splice(listenerIdx, 1);
    return true;
  }

  emit(label, ...args) {
    if (!this.listeners.has(label)) {
      return false;
    }

    this.listeners.get(label).forEach(listener => listener(...args));
    return true;
  }
}

var HeaderCookie = function(cookie_domain, name, value, attributes) {
  this.domain = cookie_domain;
  this.name = name;
  this.value = value;
  this.attributes = attributes || new Map();
}

HeaderCookie.fromString = function(header_value, current_uri) {
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

  // TODO: normalise to lowercase
  const cookie_domain = attributes.has('Domain') ? attributes.get('Domain') : getDomain(current_uri);

  // TODO: handle path attribute by extracting directory from uri
  // http://tools.ietf.org/html/rfc6265#section-4.1.2.4

  return new HeaderCookie(cookie_domain, name, value, attributes);
}

function getBaseDomain(domain) {
  if (domain.indexOf('.') == 0) {
    return domain.slice(1);
  } else {
    return domain;
  }
}

export { EventEmitter, HeaderCookie, NormalisedHeaders, getDomain };