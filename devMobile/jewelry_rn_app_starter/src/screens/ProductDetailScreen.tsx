// src/screens/ProductDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Phone, Mail, MapPin, Star, Scale, Gem } from 'lucide-react-native';

import { Card, Button, Text } from '@/components/UI';
import { fetchProductById, ProductWithVendor } from '@/services/products';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type Route = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { id } = route.params;

  const [product, setProduct] = useState<ProductWithVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err: any) {
        console.error('Failed to load product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleContactVendor = () => {
    if (product?.vendor?.phone) {
      const phoneNumber = `tel:${product.vendor.phone}`;
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Erreur", "L'appel téléphonique n'est pas supporté sur cet appareil.");
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch((err) => console.error('An error occurred', err));
    } else {
      Alert.alert("Information", "Le numéro de téléphone du vendeur n'est pas disponible.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text style={{ marginTop: 12, opacity: 0.7 }}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            {error || 'Produit non trouvé'}
          </Text>
          <Button onPress={() => navigation.goBack()}>Retour</Button>
        </View>
      </SafeAreaView>
    );
  }

  const vendor = product.vendor;
  const priceLabel = product.price 
    ? `${Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
    : '0.00 €';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: 'white',
            borderBottomWidth: 0.5,
            borderBottomColor: '#e5e7eb',
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 8, paddingVertical: 8, marginRight: 8 }}
          >
            <ArrowLeft size={20} color="#111827" />
          </Button>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Détail du produit</Text>
        </View>

        {/* Image produit */}
        <View style={{ backgroundColor: 'white' }}>
          <Image
            source={
              product.image
                ? { uri: product.image }
                : { uri: 'https://picsum.photos/400' }
            }
            style={{ width: '100%', aspectRatio: 1 }}
            resizeMode="cover"
          />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          {/* Infos produit */}
          <Card style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                  {product.name}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <Text>{(product.rating || 0).toFixed(1)}</Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 999,
                      backgroundColor: product.available ? '#dcfce7' : '#e5e7eb',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: product.available ? '#166534' : '#6b7280',
                      }}
                    >
                      {product.available ? 'Disponible' : 'Non disponible'}
                    </Text>
                  </View>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#fbbf24',
                }}
              >
                {priceLabel}
              </Text>
            </View>

            {/* Caractéristiques techniques */}
            {(product.weight || product.carat) && (
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                {product.weight && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Scale size={16} color="#6b7280" />
                    <Text style={{ fontSize: 14 }}>{product.weight} g</Text>
                  </View>
                )}
                {product.carat && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Gem size={16} color="#6b7280" />
                    <Text style={{ fontSize: 14 }}>{product.carat} ct</Text>
                  </View>
                )}
              </View>
            )}

            <View>
              <Text style={{ fontWeight: '700', marginBottom: 4 }}>Description</Text>
              <Text style={{ color: '#6b7280' }}>{product.description}</Text>
            </View>
          </Card>

          {/* Infos vendeur */}
          {vendor && (
            <Card style={{ padding: 16 }}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                Informations du vendeur
              </Text>

              <View style={{ gap: 8 }}>
                <View>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                    Nom de la boutique
                  </Text>
                  <Text>{vendor.name || vendor.company || 'N/A'}</Text>
                </View>

                {vendor.phone && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Phone size={16} color="#6b7280" />
                    <Text style={{ color: '#4b5563' }}>{vendor.phone}</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Mail size={16} color="#6b7280" />
                  <Text style={{ color: '#4b5563', flexShrink: 1 }} numberOfLines={2}>
                    {vendor.email}
                  </Text>
                </View>

                {vendor.address && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <MapPin size={16} color="#6b7280" style={{ marginTop: 2 }} />
                    <Text style={{ color: '#4b5563', flex: 1 }}>{vendor.address}</Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Bouton contact */}
          <Button
            style={{
              backgroundColor: '#fbbf24',
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
            onPress={handleContactVendor}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Phone size={18} color="#000" />
              <Text style={{ color: 'black', fontWeight: '600' }}>
                Contacter le vendeur
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
