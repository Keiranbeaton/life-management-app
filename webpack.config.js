'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const API_URL = JSON.stringify(process.env.API_URL || 'http://localhost:3000');

var plugins = [
  new MiniCssExtractPlugin({
    filename: 'bundle.css'
  }),
  new webpack.DefinePlugin({
    __API_URL__: API_URL,
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  })
];

module.exports = {
  entry: `${__dirname}/app`,
  plugins: plugins,
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [`${__dirname}/app/styles/lib`]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|gif|png)$/,
        loader:'file-loader?name=img[hash].[ext]'
      },
      {
        test: /\.ico/,
        loader: 'static-loader'
      },
      {
        test:/\.svg/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'
      },
      {
        test: /\.(woff|eot)/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.[ot]tf/,
        loader: 'url-loader?limit=10000mimetype=application/octet-stream&name=fonts/[name].[ext]'
      }
    ]
  }
}
