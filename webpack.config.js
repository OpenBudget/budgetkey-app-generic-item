'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglify-js-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  extractLess,
  new HtmlWebpackPlugin({
    template: 'index.html',
    filename: '404.html' // set filename to 404.html to handle all URLs by Angular
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }));
}

module.exports = {
  entry: {
    'main': ['./app/main.ts', './app/styles/main.less']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{loader: 'raw-loader'}, {loader: 'less-loader'}]
        })
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.html', '.less', '.css']
  },
  plugins: plugins
};
