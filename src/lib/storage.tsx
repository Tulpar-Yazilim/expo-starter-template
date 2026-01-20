import { createMMKV } from 'react-native-mmkv';
import { type StateStorage } from 'zustand/middleware/persist';

export const storage = createMMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.remove(key);
}

export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
