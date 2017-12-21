'use strict';

// Use flow check

const path = require('path');
const webpack = require('webpack');
const PATHS = {
    redux: path.join(__dirname, 'src/redux'),
    web: path.join(__dirname, 'src/web'),
    build: path.join(__dirname, 'build'),
    assets: path.join(__dirname, 'src/web/assets'),
    images: path.join(__dirname, 'src/web/assets/images')
};

let config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
      client: PATHS.web
    },
    output: {
      path: PATHS.build,
      filename: 'client.js',
      publicPath: '/'
    },

    resolve: {
      modules: [
        __dirname,
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.css', 'sass'],
      alias: {
        leaflet_css: path.join(__dirname, "/node_modules/leaflet/dist/leaflet.css"),
        leaflet_markers_css: path.join(__dirname, "/node_modules/drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css"),
        leaflet_awesome_markers: path.join(__dirname, "/node_modules/drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js"),
        deepMerge: path.join(__dirname, "/src/redux/helpers/deepMerge.js")
      }
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: [
          'babel-loader'
          ],
        include: [PATHS.web],
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [
          "style-loader", 
          "css-loader"
        ]
      }, {
        test: /\.scss$/,
        use: [
          "style-loader", 
          "css-loader", 
          "sass-loader"
        ]
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '8192'
            }
          },
          'img-loader'
        ]
      }]
    }
};

module.exports = config;
