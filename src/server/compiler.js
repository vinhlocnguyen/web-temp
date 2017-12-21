const webpack = require('webpack');
const config = require('../../webpack.config.js');

module.exports = function(app) {
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      hot: true,
      historyApiFallback: true,
      publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
};
