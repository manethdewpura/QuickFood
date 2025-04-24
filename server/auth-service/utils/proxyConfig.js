export const createProxyConfig = (route, target, circuitBreaker) => ({
  target,
  changeOrigin: true,
  pathRewrite: {
    [`^${route}`]: '',
  },
  secure: process.env.NODE_ENV === 'production',
  onProxyReq: (proxyReq, req) => {
    // Forward auth headers
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
    }
    if (req.headers['x-user-role']) {
      proxyReq.setHeader('x-user-role');
    }
  },
  onError: (err, req, res) => {
    circuitBreaker.recordFailure(target);
    res.status(503).json({ message: 'Service temporarily unavailable' });
  }
});
