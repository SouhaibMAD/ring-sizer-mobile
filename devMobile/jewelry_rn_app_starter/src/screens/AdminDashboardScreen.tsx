// src/screens/AdminDashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Users, Package, TrendingUp, AlertCircle } from 'lucide-react-native';

import { Card, Button, Text } from '@/components/UI';
import { useAuth } from '@/context/AuthContext';
import { mockVendors, mockProducts } from '@/data/mockData';

const usageData = [
  { month: 'Jan', users: 45 },
  { month: 'Fév', users: 52 },
  { month: 'Mar', users: 61 },
  { month: 'Avr', users: 75 },
  { month: 'Mai', users: 89 },
  { month: 'Jun', users: 103 },
];

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  // 🔒 Redirection si pas admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Auth' } }],
      });
    }
  }, [user, navigation]);

  if (!user || user.role !== 'admin') {
    // Pendant la redirection
    return null;
  }

  const activeVendors = mockVendors.filter(v => v.active).length;
  const inactiveVendors = mockVendors.length - activeVendors;

  const stats = {
    vendors: mockVendors.length,
    products: mockProducts.length,
    transactions: 156,
  };

  // Groupes pour la fausse "camembert" linéaire
  const groups: Record<string, number> = {};
  mockProducts.forEach(p => {
    groups[p.type] = (groups[p.type] || 0) + 1;
  });

  const pieData = Object.entries(groups).map(([name, value]) => ({
    name,
    value,
  }));
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  const PIE_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];

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
            Dashboard Admin
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            Vue d&apos;ensemble de la plateforme
          </Text>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <Users color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Vendeurs
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.vendors}</Text>
          </Card>

          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <Package color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Produits
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.products}</Text>
          </Card>

          <Card style={{ flex: 1, padding: 14, alignItems: 'center' }}>
            <TrendingUp color="#fbbf24" size={22} />
            <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
              Contacts
            </Text>
            <Text style={{ fontWeight: '700' }}>{stats.transactions}</Text>
          </Card>
        </View>

        {/* Bouton gérer vendeurs */}
        <Button
          style={{
            backgroundColor: '#fbbf24',
            paddingVertical: 10,
            borderRadius: 999,
          }}
          onPress={() => navigation.navigate('VendorManagement')}
        >
          <Text style={{ color: 'black', fontWeight: '600' }}>
            Gérer les vendeurs
          </Text>
        </Button>

        {/* Alerte vendeurs inactifs */}
        {inactiveVendors > 0 && (
          <Card
            style={{
              padding: 14,
              backgroundColor: '#fff7ed',
              borderColor: '#fed7aa',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <AlertCircle color="#c2410c" size={18} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#7c2d12',
                    fontWeight: '700',
                    marginBottom: 4,
                  }}
                >
                  Vendeurs inactifs
                </Text>
                <Text style={{ color: '#9a3412' }}>
                  {inactiveVendors} vendeur(s) sont actuellement désactivés
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Bar chart très simple */}
        <Card style={{ padding: 14 }}>
          <Text style={{ fontWeight: '700', marginBottom: 12 }}>
            Tendance d&apos;usage
          </Text>
          <View
            style={{
              height: 180,
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {usageData.map(d => {
              const h = (d.users / 110) * 160;
              return (
                <View
                  key={d.month}
                  style={{ alignItems: 'center', flex: 1 }}
                >
                  <View
                    style={{
                      height: h,
                      backgroundColor: '#fbbf24',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      width: '70%',
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                      marginTop: 6,
                    }}
                  >
                    {d.month}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Répartition produits (barre segmentée) */}
        <Card style={{ padding: 14 }}>
          <Text style={{ fontWeight: '700', marginBottom: 12 }}>
            Répartition des produits
          </Text>

          {/* barre colorée */}
          <View
            style={{
              height: 16,
              borderRadius: 999,
              overflow: 'hidden',
              flexDirection: 'row',
              marginBottom: 12,
            }}
          >
            {pieData.map((seg, i) => (
              <View
                key={seg.name}
                style={{
                  flex: seg.value,
                  backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                }}
              />
            ))}
          </View>

          {/* légende */}
          {pieData.map((seg, i) => (
            <View
              key={seg.name}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                  }}
                />
                <Text>{seg.name}</Text>
              </View>
              <Text style={{ opacity: 0.7 }}>
                {seg.value} (
                {pieTotal ? Math.round((seg.value / pieTotal) * 100) : 0}
                %)
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
