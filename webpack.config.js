const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const REACT_DEVTOOLS_URL = "http://localhost:8097/";

config = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
  },

  output: {
    filename: '[name].dist.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },

      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              ["transform-react-jsx", { "pragma":"h" }],
              'babel-plugin-transform-decorators-legacy'
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),

    new HtmlWebpackPlugin({
      filename: 'popup.dist.html',
      template: 'src/popup.html',
      chunks: ['popup'],
      reactDevtoolsUrl: REACT_DEVTOOLS_URL
    }),

    new ExtractTextPlugin("[name].dist.css"),
  ]
};

module.exports = {
  baseconfig: config,
  REACT_DEVTOOLS_URL
};