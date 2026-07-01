import '@testing-library/react-native/extend-expect';

// react-hook form setup for testing
// @ts-ignore
global.window = {};
// @ts-ignore
global.window = global;

jest.mock('react-native-mmkv', () => {
  const sharedMockStorage = new Map<string, string>();
  const createStorage = () => ({
    getString: (key: string) => sharedMockStorage.get(key),
    set: (key: string, value: string) => {
      sharedMockStorage.set(key, value);
    },
    remove: (key: string) => {
      sharedMockStorage.delete(key);
    },
    clearAll: () => {
      sharedMockStorage.clear();
    },
    getAllKeys: () => Array.from(sharedMockStorage.keys()),
    contains: (key: string) => sharedMockStorage.has(key),
    getNumber: (key: string) => {
      const value = sharedMockStorage.get(key);
      return value !== undefined ? Number(value) : undefined;
    },
    getBoolean: (key: string) => {
      const value = sharedMockStorage.get(key);
      if (value === undefined) {
        return undefined;
      }
      return value === 'true';
    },
  });
  return {
    createMMKV: (_options?: { id?: string }) => createStorage(),
    existsMMKV: jest.fn(),
    deleteMMKV: jest.fn(),
  };
});

jest.mock('react-native-worklets');
