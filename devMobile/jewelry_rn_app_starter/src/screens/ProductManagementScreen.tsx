import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text, Card, Button, Input } from '@/components/UI';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { fetchMyProducts, deleteProduct, Product } from '@/services/products';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProductManagementScreen() {
  const nav = useNavigation<Nav>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        try {
          setLoading(true);
          const data = await fetchMyProducts();
          setProducts(data);
          setError(null);
        } catch (err) {
          setError('Erreur lors du chargement de vos produits.');
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, [])
  );

  const handleDelete = (productId: number) => {
    Alert.alert(
      'Supprimer le produit',
      'Êtes-vous sûr de vouloir supprimer ce produit ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              // Optimistically remove from UI
              setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
              await deleteProduct(productId);
            } catch (error) {
              Alert.alert('Erreur', 'La suppression du produit a échoué.');
              // Optionally, revert state if deletion fails
            }
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <View style={styles.cardTopRow}>
        <Image
          source={{ uri: item.image || 'https://picsum.photos/200' }}
          style={styles.productImage}
        />
        <TouchableOpacity style={styles.infoContainer} onPress={() => nav.navigate('ProductDetail', { id: String(item.id) })}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} MAD</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardBottomRow}>
        <View style={[styles.statusBadge, { backgroundColor: item.available ? '#dcfce7' : '#fee2e2' }]}>
          <View style={[styles.statusDot, { backgroundColor: item.available ? '#22c55e' : '#ef4444' }]} />
          <Text style={[styles.statusText, { color: item.available ? '#166534' : '#991b1b' }]}>
            {item.available ? 'Disponible' : 'Indisponible'}
          </Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={() => nav.navigate('EditProduct', { productId: item.id })} style={[styles.actionButton, styles.editButton]}>
            <Text style={styles.editButtonText}>Modifier</Text>
          </Button>
          <Button onPress={() => handleDelete(item.id)} style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vos Produits</Text>
        <Button onPress={() => nav.navigate('AddProduct')} style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Button>
      </View>

      <Input
        placeholder="Rechercher des produits..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fbbf24" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Vous n'avez pas encore ajouté de produits.</Text>}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6b7280',
  },
  card: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  productPrice: {
    color: '#4b5563',
    marginTop: 4,
  },
  cardBottomRow: {
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
    marginTop: 12,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: '500',
    fontSize: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#fbbf24',
  },
  editButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
