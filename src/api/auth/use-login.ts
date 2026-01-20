import { createMutation } from 'react-query-kit';

import { signIn } from '@/lib';

import { client } from '../common';

type Variables = {
  username: string;
  password: string;
  expiresInMins?: number;
};

type Response = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

const login = async (variables: Variables) => {
  const { data } = await client({
    url: '/auth/login',
    method: 'POST',
    data: {
      ...variables,
    },
  });
  if (data && data.accessToken) {
    signIn(data);
  }
  return data;
};

export const useLogin = createMutation<Response, Variables>({
  mutationFn: (variables) => login(variables),
});
