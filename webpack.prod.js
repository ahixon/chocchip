const config = require('./webpack.config.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(config, {
  plugins: [
    new CopyWebpackPlugin([
      {
        // copy manifest unmodified
        from: 'src/manifest.json',
      }
    ]),
  ]
});