const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const devconfig = require('./webpack.dev.js');

const hmrClientConfig = 'webpack-hot-middleware/client?path=http://' +
                        devconfig.devSettings.devServerHost + ':' +
                        devconfig.devSettings.devServerPort + '/__webpack_hmr';

// inject the HMR client to all entrypoints
let hotConfig = Object.assign({}, devconfig.config);
for (const entryName in devconfig.config.entry) {
  if (devconfig.config.entry.hasOwnProperty(entryName)) {
    const entryPoint = devconfig.config.entry[entryName];
    hotConfig.entry[entryName] = [hmrClientConfig, entryPoint];
  }
}

// build the webpack on the modified config
const compiler = webpack(hotConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: devconfig.config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require("webpack-hot-middleware")(compiler));

app.listen(devconfig.devSettings.devServerPort, 
           devconfig.devSettings.devServerHost, function () {
  console.log('webpack server listening on port 8080\n');
});

var remotedev = require('remotedev-server');
remotedev({
  hostname: devconfig.devSettings.reduxDevtoolHost,
  port: devconfig.devSettings.reduxDevtoolPort
});