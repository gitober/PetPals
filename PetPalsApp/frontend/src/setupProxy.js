const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_API_URL;

if (!target) {
  throw new Error("Missing REACT_APP_API_URL in .env file");
}

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: target.replace(/\/api$/, ''),
      changeOrigin: true,
    })
  );
};