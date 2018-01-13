const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    background: './src/background/index.js',
    popup: './src/popup/index.js',
  },

  output: {
    filename: '[name].dist.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
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
              'babel-plugin-transform-decorators-legacy',
              ["babel-plugin-transform-builtin-extend", {
                  globals: ["Error"]
              }]
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
      template: 'src/popup/index.html',
      chunks: ['popup'],
    }),

    new ExtractTextPlugin("[name].dist.css"),
  ]
};