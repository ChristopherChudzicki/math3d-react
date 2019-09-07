// Followed https://medium.com/@christossotiriou/speed-up-nodejs-server-side-development-with-webpack-4-hmr-8b99a932bdda
// with some modifications.
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// Common plugins
const plugins = [
  new webpack.NamedModulesPlugin(),
];

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  externals: [
    nodeExternals()
  ],
  name: 'server',
  plugins: plugins,
  target: 'node',
  entry: {
    main: [
      'core-js/stable',
      path.resolve(path.join(__dirname, './src/index.js'))
    ],
    migrate: [
      './src/migrate.js'
    ]
  },
  output: {
    publicPath: './',
    path: path.resolve(__dirname, './build/'),
    filename: '[name].js',
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
