import { Env } from '@env';
import { Link } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  Icon,
  Pressable,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { signOut, translate, useAuth } from '@/lib';

export default function Settings() {
  const user = useAuth((state) => state.user);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? colors.neutral[400] : colors.neutral[500];

  const initials =
    user?.fullName
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('') ?? 'TL';

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1 bg-neutral-50 dark:bg-charcoal-900"
        contentContainerClassName="px-4 pb-8 pt-6 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-charcoal-800">
          <View className="flex-row items-center gap-4 p-4">
            <View className="size-14 items-center justify-center rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <Text className="text-xl font-bold text-primary-600 dark:text-primary-300">
                {initials}
              </Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-base font-bold dark:text-white">
                {user?.fullName ?? ''}
              </Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                {user?.email ?? ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <ItemsContainer title="settings.account.title">
          <Link asChild href={{ pathname: '/update-password' }}>
            <Item
              text="settings.account.password"
              icon={
                <Icon type="feather" name="lock" size={16} color={iconColor} />
              }
            />
          </Link>
        </ItemsContainer>

        {/* General */}
        <ItemsContainer title="settings.general">
          <LanguageItem />
          <ThemeItem />
        </ItemsContainer>

        {/* Links */}
        <ItemsContainer title="settings.links">
          <Link
            asChild
            href={{
              pathname: '/www',
              params: {
                url: 'https://www.google.com',
                title: translate('settings.privacy'),
              },
            }}
          >
            <Item
              text="settings.privacy"
              icon={
                <Icon
                  type="feather"
                  name="shield"
                  size={16}
                  color={iconColor}
                />
              }
            />
          </Link>
          <Link
            asChild
            href={{
              pathname: '/www',
              params: {
                url: 'https://www.google.com',
                title: translate('settings.terms'),
              },
            }}
          >
            <Item
              text="settings.terms"
              icon={
                <Icon
                  type="feather"
                  name="file-text"
                  size={16}
                  color={iconColor}
                />
              }
            />
          </Link>
          <Link
            asChild
            href={{
              pathname: '/www',
              params: {
                url: 'https://www.google.com',
                title: translate('settings.website'),
              },
            }}
          >
            <Item
              text="settings.website"
              icon={
                <Icon type="feather" name="globe" size={16} color={iconColor} />
              }
            />
          </Link>
        </ItemsContainer>

        {/* About */}
        <ItemsContainer title="settings.about">
          <Item
            text="settings.version"
            value={Env.VERSION}
            icon={
              <Icon type="feather" name="info" size={16} color={iconColor} />
            }
          />
        </ItemsContainer>

        {/* Logout */}
        <View className="overflow-hidden rounded-xl border border-danger-200 bg-white dark:border-danger-900/60 dark:bg-charcoal-800">
          <Pressable
            onPress={signOut}
            className="flex-row items-center gap-3 px-4 py-3"
          >
            <View className="size-8 items-center justify-center rounded-lg bg-danger-50 dark:bg-danger-900/40">
              <Icon
                type="feather"
                name="log-out"
                size={16}
                color={colors.danger[500]}
              />
            </View>
            <Text
              className="font-medium text-danger-500"
              tx="settings.logout"
            />
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
