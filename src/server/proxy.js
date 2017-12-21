const url = require('url');
const proxy = require('express-http-proxy');

module.exports = function(app) {
  const proxyHost = process.env.PROXY_HOST || 'localhost:3000';
  const apiKey = process.env.API_KEY;

  app.use('/api/*', proxy(proxyHost, {
    proxyReqPathResolver: (req, res) => {
      console.log("forwardpath: " + url.parse(req.originalUrl).path);
      return url.parse(req.originalUrl).path;
    },
    proxyReqOptDecorator: (reqOpt, req) => {
      const authTokenCookie = req.headers.cookie && req.headers.cookie.split(';').find(item => {
        return item.includes('authToken');
      });
      const authToken = authTokenCookie && authTokenCookie.trim().substr(10);
      if (authToken) {
        reqOpt.headers['x-auth-token'] = authToken;
      }
      reqOpt.headers['x-access-token'] = apiKey;
      return reqOpt;
    },
    limit: '5mb'
  }));

  app.post('/report-error', proxy(proxyHost, {
    proxyReqPathResolver: (req, res) => {
      console.log("forwardpath: " + url.parse(req.originalUrl).path);
      return url.parse(req.originalUrl).path;
    },
    proxyReqOptDecorator: (reqOpt, req) => {
      reqOpt.headers['x-access-token'] = apiKey;
      return reqOpt;
    }
  }));
};
