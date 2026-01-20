import type { AxiosError } from 'axios';

import { signOut } from '@/lib';

const unauthorizedCode = [401, 419, 440];

const AxiosResponseInterceptorErrorCallback = (error: AxiosError) => {
  const { response } = error;

  if (response) {
    if (unauthorizedCode.includes(response.status)) {
      signOut();
    }
  }
};

export default AxiosResponseInterceptorErrorCallback;
