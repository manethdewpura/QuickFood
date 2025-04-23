export const createProxyConfig = (route, target, circuitBreaker) => ({
  target,
  changeOrigin: true,
  pathRewrite: {
    [`^${route}`]: '',
  },
  onProxyReq: (proxyReq, req) => {
    // Forward the user ID header
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
    }
    // Forward the user role header
    if (req.headers['x-user-role']) {
      proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
    }
  },
  onError: (err, req, res) => {
    circuitBreaker.handleFailure(target);
    res.status(503).json({ message: 'Service temporarily unavailable' });
  },
  onProxyRes: () => {
    circuitBreaker.handleSuccess(target);
  },
});
