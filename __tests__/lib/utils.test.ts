import { Linking } from 'react-native';

import { createSelectors, openLinkInBrowser } from '../../src/lib/utils';

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openLinkInBrowser', () => {
    it('should open URL when canOpenURL returns true', async () => {
      const url = 'https://example.com';
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
      jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

      openLinkInBrowser(url);

      expect(Linking.canOpenURL).toHaveBeenCalledWith(url);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });

    it('should not open URL when canOpenURL returns false', async () => {
      const url = 'https://example.com';
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
      jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

      openLinkInBrowser(url);

      expect(Linking.canOpenURL).toHaveBeenCalledWith(url);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });

  describe('createSelectors', () => {
    it('should create selectors for store state', () => {
      const mockStore = {
        getState: () => ({ count: 0, name: 'test' }),
        use: {},
      } as unknown as Parameters<typeof createSelectors>[0];

      const storeWithSelectors = createSelectors(mockStore);

      expect(storeWithSelectors.use).toBeDefined();
      expect(
        typeof (storeWithSelectors.use as Record<string, unknown>).count,
      ).toBe('function');
      expect(
        typeof (storeWithSelectors.use as Record<string, unknown>).name,
      ).toBe('function');
    });
  });
});
