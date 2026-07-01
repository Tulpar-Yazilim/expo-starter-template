import { type AxiosRequestConfig, create as createAxiosInstance } from 'axios';

import { Env } from '@/lib/env';

export const client = createAxiosInstance({
  baseURL: Env.API_URL,
  timeout: 10 * 60 * 1000, // 10 minutes × 60 seconds × 1000 ms = 600.000 ms
});

export const clientInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const mergedConfig = { ...config, ...options };
  return client({ ...mergedConfig }).then((response) => response.data);
};

export default clientInstance;
