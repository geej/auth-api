const path = require('path');

module.exports = {
  mode: 'development',
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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /packages/,
        ]
      },
    ],
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
  },
  externals: {
    'aws-sdk': 'commonjs aws-sdk',
  },
};