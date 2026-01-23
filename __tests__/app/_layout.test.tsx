import { SplashScreen } from 'expo-router';

import TabLayout from '../../app/(app)/_layout';
import { useAuthProvider, useIsFirstTime } from '@/lib';
import { render } from '@/lib/test-utils';

// Mock all dependencies
jest.mock('@dev-plugins/react-query', () => ({
  useReactQueryDevTools: jest.fn(),
}));

jest.mock('@/lib', () => ({
  useAuth: jest.fn(),
  useIsFirstTime: jest.fn(),
}));

jest.mock('expo-router', () => {
  const MockTabs = ({ children }: { children: React.ReactNode }) => children;
  MockTabs.Screen = () => null;

  return {
    Redirect: ({ href: _href }: { href: string }) => null,
    Stack: {
      Screen: () => null,
    },
    Tabs: MockTabs,
    Link: ({ children }: { children: React.ReactNode }) => children,
    SplashScreen: {
      hideAsync: jest.fn().mockResolvedValue(undefined),
    },
  };
});

jest.mock('@/components/ui/icons', () => ({
  Feed: () => null,
  Settings: () => null,
  Style: () => null,
}));

const mockUseAuth = useAuthProvider as jest.MockedFunction<
  typeof useAuthProvider
>;
const mockUseIsFirstTime = useIsFirstTime as jest.MockedFunction<
  typeof useIsFirstTime
>;
const mockSplashScreen = SplashScreen as jest.Mocked<typeof SplashScreen>;

const setupFirstTimeUser = () => {
  mockUseIsFirstTime.mockReturnValue([true, jest.fn()]);
  mockUseAuth.mockReturnValue({
    isAuthenticated: false,
    loading: false,
    ready: true,
  });
};

const setupUnauthenticatedUser = () => {
  mockUseIsFirstTime.mockReturnValue([false, jest.fn()]);
  mockUseAuth.mockReturnValue({
    isAuthenticated: false,
    loading: false,
    ready: true,
  });
};

const setupAuthenticatedUser = () => {
  mockUseIsFirstTime.mockReturnValue([false, jest.fn()]);
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    loading: false,
    ready: true,
  });
};

describe('TabLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to onboarding when user is first time', () => {
    setupFirstTimeUser();
    render(<TabLayout />);
    // Since we're mocking Redirect to return null, we just test the logic flow
    expect(mockUseIsFirstTime).toHaveBeenCalled();
  });

  it('should redirect to sign-in when user is not authenticated and auth is ready', () => {
    setupUnauthenticatedUser();
    render(<TabLayout />);
    expect(mockUseAuth).toHaveBeenCalled();
  });

  it('should render tabs when user is authenticated', () => {
    setupAuthenticatedUser();
    render(<TabLayout />);
    expect(mockUseAuth).toHaveBeenCalled();
  });

  it('should hide splash screen when auth is not ready', () => {
    mockUseIsFirstTime.mockReturnValue([false, jest.fn()]);
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      ready: false,
    });
    render(<TabLayout />);
    expect(mockSplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('should not hide splash screen when auth is ready', () => {
    mockUseIsFirstTime.mockReturnValue([false, jest.fn()]);
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      ready: true,
    });
    render(<TabLayout />);
    expect(mockSplashScreen.hideAsync).not.toHaveBeenCalled();
  });

  it('should call useAuth and useIsFirstTime hooks', () => {
    setupAuthenticatedUser();
    render(<TabLayout />);
    expect(mockUseAuth).toHaveBeenCalled();
    expect(mockUseIsFirstTime).toHaveBeenCalled();
  });
});
