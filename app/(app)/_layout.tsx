import { Link, Redirect, Tabs } from 'expo-router';

import { Icon, Pressable, Text } from '@/components/ui';
import { useAuthProvider, useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const { isAuthenticated, ready } = useAuthProvider();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (!isAuthenticated && ready) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => (
            <Icon type="feather" name="home" color={color} />
          ),
          headerRight: () => <CreateNewPostLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          tabBarIcon: ({ color }) => (
            <Icon type="feather" name="codesandbox" color={color} />
          ),
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon type="feather" name="settings" color={color} />
          ),
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => (
  <Link href="/feed/add-post" asChild>
    <Pressable>
      <Text className="px-3 text-primary-300">Create</Text>
    </Pressable>
  </Link>
);
