import { retryRequest } from './retry.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createProxyConfig(route, target, circuitBreaker) {
  return {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
    secure: false,
    proxyTimeout: 30000,
    timeout: 30000,
    followRedirects: true,
    onError: async (err, req, res) => {
      circuitBreaker.recordFailure(route);
      try {
        const response = await retryRequest(
          () => createProxyMiddleware({ ...this, retry: false })(req, res),
          this
        );
        return response;
      } catch (retryError) {
        console.error(`All retries failed for ${route}:`, retryError);
        return res.status(503).json({
          code: 503,
          status: "Error",
          message: "Service temporarily unavailable",
          retryAfter: Math.ceil(circuitBreaker.states[route].resetTimeout / 1000),
        });
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      try {
        circuitBreaker.checkCircuit(route);
        console.log(`[${new Date().toISOString()}] Proxying ${req.method} ${req.url} to ${target}`);
        Object.keys(req.headers).forEach(key => proxyReq.setHeader(key, req.headers[key]));
      } catch (error) {
        res.status(503).json({
          code: 503,
          status: "Error",
          message: "Service temporarily unavailable",
          retryAfter: Math.ceil(circuitBreaker.states[route].resetTimeout / 1000),
        });
      }
    },
    onProxyRes: (proxyRes) => {
      if (proxyRes.statusCode < 500) {
        circuitBreaker.recordSuccess(route);
      }
    },
  };
}
