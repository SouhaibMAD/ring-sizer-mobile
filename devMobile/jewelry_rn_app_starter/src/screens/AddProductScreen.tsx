import React, { useState } from 'react';
import { View, ScrollView, Alert, Pressable } from 'react-native';
import { Text, Input, Button } from '@/components/UI';
import { useNavigation } from '@react-navigation/native';
import { createProduct, ProductType } from '@/services/products';

const PRODUCT_TYPES: { key: ProductType; label: string }[] = [
  { key: 'bague', label: 'Bague' },
  { key: 'collier', label: 'Collier' },
  { key: 'bracelet', label: 'Bracelet' },
  { key: 'boucles', label: "Boucles d'oreilles" },
  { key: 'montre', label: 'Montre' },
];

export default function AddProductScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProductType>('bague');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Champs manquants', 'Veuillez saisir au moins un nom et un prix.');
      return;
    }
    setLoading(true);
    try {
      await createProduct({
        name,
        price: parseFloat(price),
        description,
        type,
        image,
      });
      Alert.alert('Succès', 'Produit ajouté !');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Le produit n'a pas pu être ajouté");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Ajouter un nouveau produit</Text>
      <Input placeholder="Nom du produit" value={name} onChangeText={setName} />
      <Input placeholder="Prix" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Input placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <Input placeholder="URL de l'image" value={image} onChangeText={setImage} />

      <View style={{ marginTop: 12, marginBottom: 6 }}>
        <Text>Type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
          {PRODUCT_TYPES.map((t) => {
            const active = type === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setType(t.key)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? '#111' : '#ddd',
                  backgroundColor: active ? '#111' : 'transparent',
                }}
              >
                <Text style={{ color: active ? '#fff' : '#111' }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button onPress={handleAddProduct} loading={loading} style={{ marginTop: 16 }}>
        Ajouter le produit
      </Button>
    </ScrollView>
  );
}
