import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAppStore, useAuth } from '@/lib';

import { client } from './client';
import AxiosResponseInterceptorErrorCallback from './interceptor-error-callback';
import { toCamelCase, toSnakeCase } from './utils';

const AUTHORIZATION_HEADER = 'Authorization';
const ACCEPT_LANGUAGE = 'Accept-Language';
const CONTENT_TYPE = 'Content-Type';
const MULTIPART_FORM_DATA = 'multipart/form-data';

export default function interceptors() {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuth.getState().token;

    const { headers, data } = config;

    if (headers && headers[CONTENT_TYPE] !== MULTIPART_FORM_DATA && data) {
      config.data = toSnakeCase(config.data);
    }

    config.headers[ACCEPT_LANGUAGE] = useAppStore.getState().language;

    if (token) {
      const { accessToken } = token;
      config.headers[AUTHORIZATION_HEADER] = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => {
      response.data = toCamelCase(response.data);
      return response;
    },
    (error: AxiosError) => {
      AxiosResponseInterceptorErrorCallback(error);
      return Promise.reject(error);
    },
  );
}
