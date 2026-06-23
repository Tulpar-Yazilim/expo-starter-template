import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ScrollView, useWindowDimensions } from 'react-native';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import colors from '@/components/ui/colors';
import type { IoniconsIconName } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { translate } from '@/lib';
import { useIsFirstTime } from '@/lib/hooks';

function FeatureRow({ icon, text }: { icon: IoniconsIconName; text: string }) {
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.primary[300] : colors.primary[500];

  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-neutral-100 px-4 py-3 dark:border-charcoal-700 dark:bg-charcoal-850">
      <Icon type="ionicons" name={icon} size={22} color={iconColor} />
      <Text className="flex-1 text-base leading-snug text-charcoal-800 dark:text-charcoal-100">
        {text}
      </Text>
    </View>
  );
}

export default function Onboarding() {
  const [, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Cover viewBox is 360x310 — preserve aspect ratio at screen width
  const coverHeight = Math.round((width * 310) / 360);

  const handleContinue = () => {
    setIsFirstTime(false);
    router.replace('/sign-in');
  };

  return (
    <View className="flex-1 bg-white dark:bg-charcoal-950">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Cover width={width} height={coverHeight} />

        <View className="flex-1 rounded-t-3xl bg-white px-4 dark:bg-charcoal-900">
          <View className="mb-1 items-center pt-4">
            <Text className="text-4xl font-bold text-cyan-600 dark:text-white">
              {translate('onboarding.title')}
            </Text>
            <View className="mt-2 h-1 w-16 rounded-full bg-cyan-600 dark:bg-white" />
          </View>

          <Text className="mb-6 mt-3 text-center text-base leading-relaxed text-charcoal-500 dark:text-charcoal-400">
            {translate('onboarding.subtitle')}
          </Text>

          <View className="mt-4 gap-2">
            <FeatureRow
              icon="calendar-outline"
              text={translate('onboarding.features.production_ready')}
            />
            <FeatureRow
              icon="people-outline"
              text={translate('onboarding.features.developer_experience')}
            />
            <FeatureRow
              icon="storefront-outline"
              text={translate('onboarding.features.minimal_code')}
            />
            <FeatureRow
              icon="bar-chart-outline"
              text={translate('onboarding.features.well_maintained_libraries')}
            />
          </View>
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        className="bg-white px-4 pt-4 dark:bg-charcoal-900"
      >
        <Button label="onboarding.button_label" onPress={handleContinue} />
      </SafeAreaView>
    </View>
  );
}
