import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Package, Eye, Mail, Plus, Edit, Trash2 } from 'lucide-react-native';

import { Card, Button, Text } from '@/components/UI';
import { useAuth } from '@/context/AuthContext';
import { fetchMyProducts, deleteProduct, Product } from '@/services/products';

export default function VendorDashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Redirection si pas vendeur
  useEffect(() => {
    if (!user || user.role !== 'vendor' || !user.vendorId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Auth' } }],
      });
    }
  }, [user, navigation]);

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
              await deleteProduct(productId);
              // useFocusEffect will reload products
            } catch (error) {
              Alert.alert('Erreur', 'La suppression du produit a échoué.');
            }
          },
        },
      ]
    );
  };

  if (!user || user.role !== 'vendor' || !user.vendorId) {
    return null;
  }

  const stats = {
    products: products.length,
    views: 1247, // Donnée statique pour l'instant
    contacts: 23, // Donnée statique pour l'instant
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <Text style={styles.headerSubtitle}>Bienvenue, {user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Package color="#fbbf24" size={22} />
            <Text style={styles.statLabel}>Produits</Text>
            <Text style={styles.statValue}>{stats.products}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Eye color="#fbbf24" size={22} />
            <Text style={styles.statLabel}>Vues</Text>
            <Text style={styles.statValue}>{stats.views}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Mail color="#fbbf24" size={22} />
            <Text style={styles.statLabel}>Contacts</Text>
            <Text style={styles.statValue}>{stats.contacts}</Text>
          </Card>
        </View>

        {/* Bouton ajouter produit */}
        <Button
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Plus size={16} color="#1f2937" />
          <Text style={styles.addButtonText}>Ajouter un produit</Text>
        </Button>

        {/* Liste produits */}
        <View style={styles.productListContainer}>
          <View style={styles.productListHeader}>
            <Text style={styles.productListTitle}>Mes produits</Text>
            <Text style={styles.productListCount}>{products.length} produit(s)</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fbbf24" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {products.map(product => (
                <Card key={product.id} style={styles.productCard}>
                  <View style={styles.productCardRow}>
                    <Image
                      source={{ uri: product.image || 'https://picsum.photos/200' }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
                      <Text style={styles.productPrice}>{product.price.toLocaleString('fr-FR')} MAD</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.productActions}>
                    <Button
                      variant="outline"
                      style={styles.actionButton}
                      onPress={() => navigation.navigate('ProductDetail', { id: String(product.id) })}
                    >
                      <Eye size={14} color="#4b5563" />
                      <Text style={styles.actionButtonText}>Voir</Text>
                    </Button>
                    <Button
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => navigation.navigate('EditProduct', { productId: product.id })}
                    >
                      <Edit size={14} color="#1f2937" />
                      <Text style={styles.editButtonText}>Modifier</Text>
                    </Button>
                    <Button
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} color="#ffffff" />
                      <Text style={styles.deleteButtonText}>Supprimer</Text>
                    </Button>
                  </View>
                </Card>
              ))}
              {products.length === 0 && <Text style={styles.emptyText}>Vous n'avez pas encore de produits.</Text>}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  headerContainer: {
    backgroundColor: '#fbbf24',
    borderRadius: 14,
    padding: 16,
  },
  headerTitle: {
    color: '#1f2937',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#374151',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 6,
    fontSize: 12,
  },
  statValue: {
    fontWeight: '700',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 16,
  },
  productListContainer: {
    marginTop: 8,
  },
  productListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  productListTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  productListCount: {
    opacity: 0.6,
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  productCard: {
    padding: 12,
    borderRadius: 12,
  },
  productCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: '700',
    fontSize: 16,
  },
  productDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginVertical: 4,
  },
  productPrice: {
    color: '#1f2937',
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#4b5563'
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
