const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const devconfig = require('./webpack.dev.js');
const compiler = webpack(devconfig.config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: devconfig.config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.listen(8080, function () {
  console.log('webpack server listening on port 8080\n');
});

var remotedev = require('remotedev-server');
remotedev({
  hostname: devconfig.devSettings.reduxDevtoolHost,
  port: devconfig.devSettings.reduxDevtoolPort
});