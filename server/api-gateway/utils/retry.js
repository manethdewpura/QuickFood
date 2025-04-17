export const retryConfig = {
  maxRetries: 3,
  initialRetryDelay: 1000,
  maxRetryDelay: 5000,
};

export async function retryRequest(proxyReq, options, attempt = 1) {
  try {
    return await proxyReq();
  } catch (error) {
    if (attempt >= retryConfig.maxRetries) throw error;
    
    const delay = Math.min(
      retryConfig.initialRetryDelay * Math.pow(2, attempt - 1),
      retryConfig.maxRetryDelay
    );
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(proxyReq, options, attempt + 1);
  }
}
