import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

/* ---------- TYPES ---------- */
type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: Array<string>;
  brand: string;
  sku: string;
};

/* ---------- DATA ---------- */
const data: Array<Product> = [
  {
    id: 1,
    title: 'Essence Mascara Lash Princess',
    category: 'beauty',
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ['beauty', 'mascara'],
    brand: 'Essence',
    sku: 'RCH45Q1A',
  },
  {
    id: 2,
    title: 'Essence Mascara Lash Princess 2',
    category: 'beauty',
    price: 11.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ['beauty', 'mascara'],
    brand: 'Essence',
    sku: 'RCH45Q1A',
  },
];

/* ---------- COMPONENT ---------- */
export default function Feed() {
  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => (
      <View className="border-b border-gray-200 p-4">
        <Text className="text-base font-semibold">{item.title}</Text>

        <Text className="text-sm text-gray-500">
          {item.brand} • {item.category}
        </Text>

        <Text className="mt-1">💰 {item.price} $</Text>

        <Text className="mt-1 text-xs text-gray-400">
          ⭐ {item.rating} | Stock: {item.stock}
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />

      <FlashList<Product>
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<EmptyList isLoading={false} />}
      />
    </View>
  );
}
