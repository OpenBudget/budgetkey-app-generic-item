'use strict';

var path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    alias: {
      'karma-test-shim$': path.resolve(__dirname, './karma-test-shim.ts')
    }
  }
};
