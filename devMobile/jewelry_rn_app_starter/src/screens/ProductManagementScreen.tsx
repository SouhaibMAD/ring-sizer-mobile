import React from 'react';
import { View } from 'react-native';
import { Text, Card, Button } from '@/components/UI';

export default function ProductManagementScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Product Management</Text>
      <Card><Text>Create / Update / Delete products (wire up your API here)</Text></Card>
      <Button onPress={() => {}}>Add product</Button>
    </View>
  );
}
