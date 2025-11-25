// src/screens/HomeScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
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

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        
        // Map API products to HomeScreen format
        const mappedProducts: Product[] = data.map((p) => {
          const category = typeToCategory[p.type] || 'Other';
          console.log(`📝 Mapping product ${p.id}: ${p.name} (type: ${p.type} → category: ${category})`);
          return {
            id: p.id,
            name: p.name || 'Unnamed Product',
            price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
            description: p.description,
            type: p.type,
            image: p.image,
            images: p.image ? [p.image] : undefined,
            category: category,
          };
        });
        
        console.log(`✅ Total mapped products: ${mappedProducts.length}`);
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
        // Fallback to mock data on error
        setProducts(mockProducts as unknown as Product[]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    console.log(`🔍 Filtering: Starting with ${items.length} products`);
    console.log(`🔍 Active filters: category="${activeCat}", query="${query}", minPrice="${minPrice}", maxPrice="${maxPrice}"`);

    // Recherche
    const q = query.trim().toLowerCase();
    if (q) {
      const beforeSearch = items.length;
      items = items.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
      console.log(`🔍 After search filter: ${beforeSearch} → ${items.length}`);
      // Check if product 6 is filtered out
      const product6 = items.find(p => p.id === 6);
      if (!product6) {
        console.log(`⚠️ Product 6 filtered out by search! Query: "${q}"`);
      }
    }

    // Catégorie
    if (activeCat !== 'All') {
      const beforeCategory = items.length;
      items = items.filter((p) => (p.category || '') === activeCat);
      console.log(`🔍 After category filter (${activeCat}): ${beforeCategory} → ${items.length}`);
      // Check if product 6 is filtered out
      const product6 = items.find(p => p.id === 6);
      if (!product6) {
        console.log(`⚠️ Product 6 filtered out by category! Active: "${activeCat}", Product category: "${products.find(p => p.id === 6)?.category}"`);
      }
    }

    // Plage de prix
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min) && min > 0) {
      const beforeMin = items.length;
      items = items.filter((p) => (p.price || 0) >= min);
      console.log(`🔍 After min price filter (${min}): ${beforeMin} → ${items.length}`);
    }
    if (!Number.isNaN(max) && max > 0) {
      const beforeMax = items.length;
      items = items.filter((p) => (p.price || 0) <= max);
      console.log(`🔍 After max price filter (${max}): ${beforeMax} → ${items.length}`);
      // Check if product 6 is filtered out
      const product6 = items.find(p => p.id === 6);
      if (!product6 && max > 0) {
        const product6Price = products.find(p => p.id === 6)?.price || 0;
        console.log(`⚠️ Product 6 filtered out by max price! Max: ${max}, Product price: ${product6Price}`);
      }
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
        // ordre d'origine = recommandé
        break;
    }
    console.log(`✅ Final filtered products: ${clone.length}`);
    const product6InFinal = clone.find(p => p.id === 6);
    if (!product6InFinal) {
      console.log(`❌ Product 6 NOT in final filtered list!`);
      console.log(`   Product 6 data:`, products.find(p => p.id === 6));
    } else {
      console.log(`✅ Product 6 IS in final filtered list at position ${clone.findIndex(p => p.id === 6)}`);
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
            {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{ opacity: 0.7 }}>•</Text>
          <Text style={{ opacity: 0.7 }}>
            Sort: {SORTS.find((s) => s.key === sortKey)?.label}
          </Text>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={{ marginTop: 12, opacity: 0.7 }}>Loading products...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={{ padding: 16, backgroundColor: '#fee2e2', borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: '#dc2626' }}>{error}</Text>
            <Text style={{ color: '#dc2626', marginTop: 4, fontSize: 12 }}>
              Showing mock data as fallback
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
            paddingBottom: Math.max(tabBarHeight + 24, 100), // sécure pour la barre du bas + scroll
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
