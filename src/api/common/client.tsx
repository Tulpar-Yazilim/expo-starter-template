import axios from 'axios';

import { Env } from '@/lib/env';

export const client = axios.create({
  baseURL: Env.API_URL,
  timeout: 10 * 60 * 1000, // 10 minutes × 60 seconds × 1000 ms = 600.000 ms
});
