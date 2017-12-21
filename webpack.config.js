const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
const CompressionPlugin = require('compression-webpack-plugin');

const PATHS = {
    redux: path.resolve(__dirname, 'src/redux'),
    web: path.resolve(__dirname, 'src/web'),
    build: path.resolve(__dirname, 'build'),
    assets: path.resolve(__dirname, 'src/web/assets'),
    images: path.resolve(__dirname, 'src/web/assets/images')
};

process.env.BABEL_ENV = TARGET;

const nodeEnv = process.env.NODE_ENV || 'development';
const proxyHost = process.env.PROXY_HOST || 'http://localhost:3000';
const apiKey = process.env.API_KEY || '12345678';
const domain = process.env.DOMAIN || 'http://localhost:8080';

const clientConfig = {
    name: 'client',
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: [
                    'react-hot-loader/webpack',
                    'babel-loader'
                ],
                exclude: ['/node_modules/'],
                include: [PATHS.redux, PATHS.web]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        }
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
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: '8192'
                        }
                    },
                    'img-loader'
                ]
            }
        ],
        noParse: [
            /libphonenumber\.js/
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname),
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
        new webpack.DefinePlugin({
            'process.env.PROXY_HOST': JSON.stringify(proxyHost),
            'process.env.API_KEY': JSON.stringify(apiKey),
            'process.env.DOMAIN': JSON.stringify(domain),
            'process.env.NODE_ENV': JSON.stringify(nodeEnv)
        }),
        new webpack.ProvidePlugin({
            Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
            fetch: 'imports-loader?this=>global!exports-loader?global.fetch!isomorphic-fetch'
        }),
        new ExtractTextPlugin({
            filename: 'styles.css'
        })
    ]
};

const productionConfig = {
    entry: {
        client: PATHS.web,
        vendors: [
            'react', 'react-dom', 'react-router-dom','react-intl',
            'redux-logger', 'react-hot-loader',
            'material-ui', 'webpack-hot-middleware', 'leaflet',
            'lodash', 'radium',  'moment', 
            'intl-messageformat-parser',
            'react-ga', 'intl-relativeformat',
            'whatwg-fetch', 'normalizr', 'react-telephone-input'
        ]
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].[hash].chunk.js',
        path: PATHS.build,
        publicPath: '/'
    },
    devtool: 'hidden-source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: `${PATHS.assets}/favicon`, to: 'favicon' }
            // { from: `${PATHS.assets}/index.html`, to: 'index.html' }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendors'],
            filename: "[name].bundle.js",
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
            },
            output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true,
            },
            sourceMap: true,
            // compress: {
            //     warnings: true
            // }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.DefinePlugin(JSON.stringify(nodeEnv)),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};

if (nodeEnv === 'development') {
    module.exports = merge(clientConfig, {
        entry: [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr',
            PATHS.web
        ],
        output: {
            path: PATHS.build,
            filename: 'client.js',
            publicPath: '/',
            libraryTarget: 'umd'
        },
        devServer: {
            contentBase: PATHS.build,
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            stats: 'errors-only',
            filename: 'client.js',
            host: process.env.HOST,
            port: process.env.PORT
        },
        devtool: 'source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    });
} else {
    module.exports = merge(clientConfig, productionConfig);
}
