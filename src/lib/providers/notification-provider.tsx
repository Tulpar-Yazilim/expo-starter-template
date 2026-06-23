import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { type ReactNode, useEffect, useRef } from 'react';

import {
  configureNotificationHandler,
  registerForPushNotifications,
} from '@/lib/notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    configureNotificationHandler();
    registerForPushNotifications();

    // Fires when a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});

    // Fires when the user taps a notification (foreground, background, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<
          string,
          string
        >;

        if (data?.route) {
          router.push(data.route as never);
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);

  return children;
}
