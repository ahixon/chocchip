# Choc Chip

uBlock Origin, but for cookies.

Many web servers send cookies that are set to expire far longer than they need to, often for tracking purposes. Choc Chip allows you to downgrade pesistent cookies to session cookies, or simply ignore them all together.

Importantly, this can happen transparently to the underlying web page.

Likewise, many websites also use multiple 3rd party cookies. Although you can disable these entirely in Chrome (which I do), Choc Chip allows you to more fine-grainly modify which ones get applied and which don't.

# Building

## Production

    npm run build

Later, this will zip the extension and add any resources to it.

## Development

    npm run start

This will build an extension with hot-reload, so you can modify the extension and it will live-update in Chrome.

To install the extension, open the Extensions manager, and load the unpacked extension from `dist`.

### How it works

#### Webpack

`webpack-dev-server` doesn't serve from disk, but rather from memory.

So, either we would require two commands -- one `webpack` to build and `webpack-dev-server` to actually host the dev server, or we can integrate them into a single build script.

Main downside of two commands is aside from having, well, two commands, is that `webpack-dev-server` executes the config from `webpack.config.js`. So, if we have a `CleanWebpackPlugin`, it will delete the `dist` bundle folder before running the dev server, which would normally delete the bundles that we were hoping to use as the unpacked extension in the first place.

To make this work, we need `write-file-webpack-plugin`, which writes out the bundle to disk.

#### CSP

Chrome by default enforces a strict [Content Security Policy on extensions](https://developer.chrome.com/extensions/contentSecurityPolicy). This includes `eval`-ing any Javascript code, and doing XHR requests outside of the extension's sandbox.

We relax this when running a development build so that HMR works. For example, to load any modified chunks, we have to make a request to the dev-server on localhost that is watching for changed files.

This is done by adding a `content_security_policy` field to the extension's manifest.