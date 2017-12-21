'use strict';

require('babel-register');

global.navigator = { userAgent: 'all' };

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();
const port = 8080;

// proxy setup
require('./proxy')(app);

// webpack auto compile
if (process.env.NODE_ENV === 'development') {
  require('./compiler')(app);
}

app.use(helmet());
app.use(express.static(path.join(__dirname, '../../build')));

// this middleware to Express to return .js.gz so you can
// still load bundle.js from the html but will receive bundle.js.gz
app.get('/*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  return next();
});

// redirects if the domain includes www-prefix
app.get('/*', function(req, res, next) {
  const host = req.headers.host;
  const url = req.originalUrl || req.url;
  if (host.split('.')[0] === 'www') {
    return res.redirect(301, process.env.DOMAIN + url);
  };
  return next();
});

// server-side rendering setup
require('./renderer')(app);

// load index file

// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, '../../build/index.html'));
// });

// create server
app.listen(port, err => {
  if (err) {
    console.warn(err);
  } else {
    console.log(`App is listening at port ${port}`);
  }
});
// logs
console.log("===Environment variables===");
console.log({
  domain: process.env.DOMAIN,
  proxy: process.env.PROXY_HOST,
  node_env: process.env.NODE_ENV
});
console.log("===Enabled/Disabled features===");
Object.keys(process.env).filter(key => key.indexOf('feature') > -1).forEach(key => {
  console.log(`${key}: ${process.env[key]}`);
});
console.log("===============================");
