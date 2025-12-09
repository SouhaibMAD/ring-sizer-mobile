// src/screens/HomeScreen.tsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text, Input, Button, Card } from '@/components/UI';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { fetchProducts, Product as ApiProduct } from '@/services/products';
import { mockProducts } from '@/data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Product = {
  id: string | number;
  name: string;
  price: number;
  images?: string[];
  image?: string | null;
  category?: string;
  type?: string;
};

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Watches'] as const;

const SORTS = [
  { key: 'reco', label: 'Recommended' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
  { key: 'name-asc', label: 'Name A→Z' },
  { key: 'name-desc', label: 'Name Z→A' },
] as const;

// Map API product types to display categories
const typeToCategory: Record<string, string> = {
  bague: 'Rings',
  bracelet: 'Bracelets',
  collier: 'Necklaces',
  boucles: 'Earrings',
  montre: 'Watches',
};

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const tabBarHeight = useBottomTabBarHeight(); // hauteur de la barre d'onglets
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortKey, setSortKey] = useState<typeof SORTS[number]['key']>('reco');

  // Load products from API when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchProducts();
          
          const mappedProducts: Product[] = data.map((p) => ({
            id: p.id,
            name: p.name || 'Unnamed Product',
            price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
            description: p.description,
            type: p.type,
            image: p.image,
            images: p.image ? [p.image] : undefined,
            category: typeToCategory[p.type] || 'Other',
          }));
          
          setProducts(mappedProducts);
        } catch (err) {
          console.error('Failed to load products:', err);
          setError('Failed to load products');
          setProducts(mockProducts as unknown as Product[]);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, [])
  );

  const filteredProducts = useMemo(() => {
    let items = [...products];

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
    if (!Number.isNaN(min) && min > 0) {
      items = items.filter((p) => (p.price || 0) >= min);
    }
    if (!Number.isNaN(max) && max > 0) {
      items = items.filter((p) => (p.price || 0) <= max);
    }

    // Tri
    const clone = [...items];
    switch (sortKey) {
      case 'price-asc':
        clone.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        clone.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        clone.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        clone.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'reco':
      default:
        break;
    }
    
    return clone;
  }, [products, query, activeCat, minPrice, maxPrice, sortKey]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => nav.navigate('ProductDetail', { id: String(item.id) })}
    >
      <Card style={{ alignItems: 'center' }}>
        <Image
          source={{ 
            uri: item.images?.[0] || item.image || 'https://picsum.photos/400' 
          }}
          style={{ width: '100%', height: 140, borderRadius: 10 }}
        />
        <Text style={{ marginTop: 8, fontWeight: '700' }}>{item.name}</Text>
        <Text style={{ opacity: 0.7 }}>{item.category || '—'}</Text>
        <Text style={{ marginTop: 4 }}>
          €{item.price ? Number(item.price).toFixed(2) : '0.00'}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, padding: 16, paddingBottom: Math.max(tabBarHeight + 16, 80), gap: 12 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '800' }}>Découvrir les bijoux</Text>
          <Button style={{ paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => setFiltersOpen(true)}>
            Filtres
          </Button>
        </View>

        {/* Recherche */}
        <Input
          placeholder="Rechercher des bagues, bracelets, colliers…"
          value={query}
          onChangeText={setQuery}
        />

        {/* Onglets Catégories */}
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
            {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{ opacity: 0.7 }}>•</Text>
          <Text style={{ opacity: 0.7 }}>
            Trier par : {SORTS.find((s) => s.key === sortKey)?.label}
          </Text>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={{ marginTop: 12, opacity: 0.7 }}>Chargement des produits...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={{ padding: 16, backgroundColor: '#fee2e2', borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: '#dc2626' }}>{error}</Text>
            <Text style={{ color: '#dc2626', marginTop: 4, fontSize: 12 }}>
              Affichage des données de démonstration
            </Text>
          </View>
        )}

        {/* Grille produits */}
        {!loading && (
          <FlatList
            data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Math.max(tabBarHeight + 24, 100),
          }}
            showsVerticalScrollIndicator={false}
          />
        )}

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
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Filtres</Text>

              {/* Prix min/max */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text>Prix minimum (MAD)</Text>
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
                  <Text>Prix maximum (MAD)</Text>
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
                <Text style={{ marginBottom: 6 }}>Trier par</Text>
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
                  Réinitialiser
                </Button>
                <Button style={{ flex: 1 }} onPress={() => setFiltersOpen(false)}>
                  Appliquer
                </Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
