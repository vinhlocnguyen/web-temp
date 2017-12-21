var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';

const PATHS = {
  redux: path.resolve(__dirname, 'src/redux'),
  web: path.resolve(__dirname, 'src/web'),
  build: path.resolve(__dirname, 'build'),
  server: path.resolve(__dirname, 'src/server')
};

module.exports = {

  entry: path.resolve(__dirname, 'src/server/index.js'),

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.bundle.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server', 'react/addons'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext;
  }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        exclude: ['/node_modules/'],
        include: [PATHS.server, PATHS.redux, PATHS.web]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options:
            {
              limit: '8192'
            }
          },
          'img-loader'
        ]
      }
    ]
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      leaflet_css: path.resolve(__dirname, "node_modules/leaflet/dist/leaflet.css"),
      leaflet_markers_css: path.resolve(__dirname, "node_modules/drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css"),
      leaflet_awesome_markers: path.resolve(__dirname, "node_modules/drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js"),
      deepMerge: path.resolve(__dirname, "src/redux/helpers/deepMerge.js")
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: path.resolve(PATHS.build, 'styles.css')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    })
  ]
};
