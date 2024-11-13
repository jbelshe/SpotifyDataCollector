// const proxy = require('http-proxy-middleware');

// module.exports = function (app) {
//     app.use(proxy(`/auth/**`, { 
//         target: 'http://localhost:5001',
//         changeOrigin: true
//     }));
// };

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/auth',
    createProxyMiddleware({
      target: 'http://localhost:5001/auth',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to:', proxyReq.getHeader('host'));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Received response from:', proxyRes.headers['location']);
      },
    })
  );
  app.use('/song',
    createProxyMiddleware({
      target: 'http://localhost:5001/song',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to:', proxyReq.getHeader('host'));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Received response from:', proxyRes.headers['location']);
      },
    })
  );
};