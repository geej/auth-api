const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/handler.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'handler.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },
  externals: {
    'aws-sdk': 'commonjs aws-sdk',
  },
};