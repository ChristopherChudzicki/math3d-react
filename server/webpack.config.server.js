// Followed https://medium.com/@christossotiriou/speed-up-nodejs-server-side-development-with-webpack-4-hmr-8b99a932bdda
// with some modifications.
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const isProduction = process.env.NODE_ENV !== 'development';

// Common plugins
const plugins = [
  new webpack.NamedModulesPlugin(),
];

const entry =[
  'core-js/stable',
  path.resolve(path.join(__dirname, './src/index.js'))
]

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  externals: [
    nodeExternals()
  ],
  name : 'server',
  plugins: plugins,
  target: 'node',
  entry: entry,
  output: {
    publicPath: './',
    path: path.resolve(__dirname, './build/'),
    filename: 'index.js',
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules')
    ]
  },
  module : {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
      }
    ],
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  }
};
