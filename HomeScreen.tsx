// src/screens/HomeScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text, Input, Button, Card } from '@/components/UI';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { mockProducts } from '@/data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Product = {
  id: string | number;
  name: string;
  price: number;
  images?: string[];
  category?: string;
};

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'] as const;

const SORTS = [
  { key: 'reco', label: 'Recommended' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
  { key: 'name-asc', label: 'Name A→Z' },
  { key: 'name-desc', label: 'Name Z→A' },
] as const;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const tabBarHeight = useBottomTabBarHeight(); // hauteur de la barre d’onglets
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('All');

  // Filtres
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortKey, setSortKey] = useState<typeof SORTS[number]['key']>('reco');

  const products = useMemo(() => {
    let items = (mockProducts as unknown as Product[]) ?? [];

    // Recherche
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Catégorie
    if (activeCat !== 'All') {
      items = items.filter((p) => (p.category || '') === activeCat);
    }

    // Plage de prix
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min) && min > 0) items = items.filter((p) => p.price >= min);
    if (!Number.isNaN(max) && max > 0) items = items.filter((p) => p.price <= max);

    // Tri
    const clone = [...items];
    switch (sortKey) {
      case 'price-asc':
        clone.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        clone.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        clone.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        clone.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'reco':
      default:
        // ordre d'origine = recommandé
        break;
    }
    return clone;
  }, [query, activeCat, minPrice, maxPrice, sortKey]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => nav.navigate('ProductDetail', { id: String(item.id) })}
    >
      <Card style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: item.images?.[0] || 'https://picsum.photos/400' }}
          style={{ width: '100%', height: 140, borderRadius: 10 }}
        />
        <Text style={{ marginTop: 8, fontWeight: '700' }}>{item.name}</Text>
        <Text style={{ opacity: 0.7 }}>{item.category || '—'}</Text>
        <Text style={{ marginTop: 4 }}>{item.price} MAD</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'left', 'right']}>
      {/* paddingBottom dynamique pour éviter tout chevauchement avec l’onglet */}
      <View style={{ flex: 1, padding: 16, paddingBottom: Math.max(tabBarHeight + 16, 80), gap: 12 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4, // décoller légèrement du bord haut
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '800' }}>Discover Jewelry</Text>
          <Button style={{ paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => setFiltersOpen(true)}>
            Filters
          </Button>
        </View>

        {/* Recherche */}
        <Input
          placeholder="Search rings, bracelets, necklace…"
          value={query}
          onChangeText={setQuery}
        />

        {/* Onglets Catégories (segmented control) */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => {
            const active = c === activeCat;
            return (
              <Pressable
                key={c}
                onPress={() => setActiveCat(c)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? '#111' : '#ddd',
                  backgroundColor: active ? '#111' : 'transparent',
                }}
              >
                <Text style={{ color: active ? '#fff' : '#111', fontWeight: '600' }}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Résumé filtres/tri */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ opacity: 0.7 }}>
            {products.length} item{products.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{ opacity: 0.7 }}>•</Text>
          <Text style={{ opacity: 0.7 }}>
            Sort: {SORTS.find((s) => s.key === sortKey)?.label}
          </Text>
        </View>

        {/* Grille produits */}
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Math.max(tabBarHeight + 24, 100), // sécure pour la barre du bas + scroll
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal Filtres */}
        <Modal
          visible={filtersOpen}
          animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
          transparent
          onRequestClose={() => setFiltersOpen(false)}
        >
          <Pressable
            onPress={() => setFiltersOpen(false)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.35)',
              justifyContent: 'flex-end',
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Filters</Text>

              {/* Prix min/max */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text>Min price (MAD)</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="0"
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text>Max price (MAD)</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholder="10000"
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      padding: 10,
                      marginTop: 6,
                    }}
                  />
                </View>
              </View>

              {/* Tri */}
              <View>
                <Text style={{ marginBottom: 6 }}>Sort by</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {SORTS.map((s) => {
                    const active = sortKey === s.key;
                    return (
                      <Pressable
                        key={s.key}
                        onPress={() => setSortKey(s.key)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: active ? '#111' : '#ddd',
                          backgroundColor: active ? '#111' : 'transparent',
                        }}
                      >
                        <Text style={{ color: active ? '#fff' : '#111' }}>{s.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                <Button
                  style={{ flex: 1, backgroundColor: '#e5e7eb' }}
                  onPress={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setSortKey('reco');
                    setFiltersOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button style={{ flex: 1 }} onPress={() => setFiltersOpen(false)}>
                  Apply
                </Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
