const config = require('./webpack.config.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(config.baseconfig, {
  devtool: 'inline-source-map',

  devServer: {
    // enable HMR for webpack-dev-server
    hot: true
  },

  plugins: [
    // define NODE_ENV to be development for preact/debug
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      }
    }),

    new CopyWebpackPlugin([
      {
        // copy manifest, but insert unsafe
        // content_security_policy so that HMR works
        from: 'src/manifest.json',
        transform: function (content, path) {
          const manifest = JSON.parse(content.toString());

          const csp = [
            ...(manifest.content_security_policy || []),
            "script-src 'self' 'unsafe-eval' " + config.REACT_DEVTOOLS_URL,
            "object-src 'self'"
          ];

          if (manifest.content_security_policy) {
            console.warn('warning: updated existing manifest ' + 
                         '`content_security_policy`');
          }

          return Buffer.from(JSON.stringify({
            ...manifest,
            content_security_policy: csp.join('; ')
          }, null, 2));
        }
      }
    ]),

    // generate named modules to make HMR debugging easier
    new webpack.NamedModulesPlugin(),

    // emit HMR chunks (so that the generated code will connect to
    // webpack-dev-server)
    new webpack.HotModuleReplacementPlugin(),

    // get webpack-dev-server to write out bundles to disk, rather than
    // generating it only in memory
    new WriteFilePlugin()
  ]
});