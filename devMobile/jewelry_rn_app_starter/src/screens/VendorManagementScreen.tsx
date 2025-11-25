import React from 'react';
import { View } from 'react-native';
import { Text, Card } from '@/components/UI';

export default function VendorManagementScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Vendor Management</Text>
      <Card><Text>Add / Remove vendors and manage permissions.</Text></Card>
    </View>
  );
}
