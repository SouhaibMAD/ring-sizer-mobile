// src/screens/VendorDashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Package, Eye, Mail, Plus, Edit, Trash2 } from 'lucide-react-native';

import { Card, Button, Text } from '@/components/UI';
import { useAuth } from '@/context/AuthContext';
import { getProductsByVendor, getVendorById } from '@/data/mockData';

export default function VendorDashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  // 🔒 Redirection si pas vendeur
  useEffect(() => {
    console.log("USER IN DASHBOARD:", user);
    if (!user || user.role !== 'vendor' || !user.vendorId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Auth' } }],
      });
    }
  }, [user, navigation]);

  if (!user || user.role !== 'vendor' || !user.vendorId) {
    return null;
  }
  


  const vendor = getVendorById(user.vendorId!.toString());
  const products = getProductsByVendor(user.vendorId!.toString());


  const stats = {
    products: products.length,
    views: 1247,
    contacts: 23,
  };

  const badgeBg = (available: boolean) =>
    available ? '#dcfce7' : '#e5e7eb';
  const badgeText = (available: boolean) =>
    available ? '#166534' : '#4b5563';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: '#f59e0b',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '800',
              marginBottom: 6,
            }}
          >
            Tableau de bord
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            Bienvenue, {vendor?.name ?? 'Vendeur'}
          </Text>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <Package color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Produits
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.products}</Text>
          </Card>

          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <Eye color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Vues
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.views}</Text>
          </Card>

          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <Mail color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Contacts
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.contacts}</Text>
          </Card>
        </View>

        {/* Bouton ajouter produit */}
        <Button
          style={{
            backgroundColor: '#fbbf24',
            paddingVertical: 10,
            borderRadius: 999,
          }}
          onPress={() => navigation.navigate('ProductManagement')}
        >
          <Text style={{ color: 'black', fontWeight: '600' }}>
            <Plus size={16} /> Ajouter un produit
          </Text>
        </Button>

        {/* Liste produits */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '700', fontSize: 16 }}>
              Mes produits
            </Text>
            <Text style={{ opacity: 0.6, fontSize: 12 }}>
              {products.length} produit(s)
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {products.map(product => (
              <Card key={product.id} style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                    }}
                  >
                    <Image
                      source={
                        product.image
                          ? { uri: product.image }
                          : require('../../assets/placeholder.png')
                      }
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={{ flex: 1, minHeight: 80 }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        opacity: 0.7,
                        marginBottom: 6,
                      }}
                      numberOfLines={2}
                    >
                      {product.description}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: '#fbbf24',
                          fontWeight: '700',
                        }}
                      >
                        {product.price.toLocaleString('fr-FR')} €
                      </Text>

                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 999,
                          backgroundColor: badgeBg(product.available),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: badgeText(product.available),
                          }}
                        >
                          {product.available
                            ? 'Disponible'
                            : 'Indisponible'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    marginTop: 10,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                  }}
                >
                  <Button
                    variant="outline"
                    style={{ flex: 1, paddingVertical: 6 }}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        id: product.id,
                      })
                    }
                  >
                    <Text>
                      <Eye size={14} /> Voir
                    </Text>
                  </Button>

                  <Button
                    variant="outline"
                    style={{ flex: 1, paddingVertical: 6 }}
                    onPress={() =>
                      navigation.navigate('ProductManagement', {
                        productId: product.id,
                      })
                    }
                  >
                    <Text>
                      <Edit size={14} /> Modifier
                    </Text>
                  </Button>

                  <Button
                    variant="outline"
                    style={{
                      paddingVertical: 6,
                      borderColor: '#ef4444',
                    }}
                    onPress={() => {
                      // TODO: logique de suppression plus tard
                    }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
