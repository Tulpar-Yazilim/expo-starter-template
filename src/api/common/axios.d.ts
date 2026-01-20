import type { InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosInterceptorManager<V> {
    handlers: Array<{
      fulfilled: ((value: V) => V | Promise<V>) | null;
      rejected: ((error: unknown) => unknown) | null;
      synchronous: boolean;
      runWhen: (config: InternalAxiosRequestConfig) => boolean | null;
    }>;
  }
}
