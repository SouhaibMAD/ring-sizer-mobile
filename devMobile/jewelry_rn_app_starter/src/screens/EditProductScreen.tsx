import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Text, Input, Button } from '@/components/UI';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProductById, updateProduct, ProductType } from '@/services/products';

const PRODUCT_TYPES: { key: ProductType; label: string }[] = [
  { key: 'bague', label: 'Bague' },
  { key: 'collier', label: 'Collier' },
  { key: 'bracelet', label: 'Bracelet' },
  { key: 'boucles', label: "Boucles d'oreilles" },
  { key: 'montre', label: 'Montre' },
];

export default function EditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProductType>('bague');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(productId);
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description);
        setType(product.type);
        setImage(product.image || '');
        setAvailable(product.available);
      } catch (error) {
        Alert.alert('Erreur', 'Le chargement du produit a échoué.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleUpdateProduct = async () => {
    setSaving(true);
    try {
      await updateProduct(productId, {
        name,
        price: parseFloat(price),
        description,
        type,
        image,
        available,
      });
      Alert.alert('Succès', 'Produit mis à jour !');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'La mise à jour du produit a échoué.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fbbf24" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Modifier le produit</Text>
      <Input placeholder="Nom du produit" value={name} onChangeText={setName} />
      <Input placeholder="Prix" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Input placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <Input placeholder="URL de l'image" value={image} onChangeText={setImage} />

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.buttonGroup}>
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

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Statut</Text>
        <View style={styles.buttonGroup}>
          <Button
            onPress={() => setAvailable(true)}
            style={[styles.statusButton, available && styles.availableButton]}
          >
            <Text style={[styles.statusButtonText, available && styles.availableButtonText]}>Disponible</Text>
          </Button>
          <Button
            onPress={() => setAvailable(false)}
            style={[styles.statusButton, !available && styles.unavailableButton]}
          >
            <Text style={[styles.statusButtonText, !available && styles.unavailableButtonText]}>Indisponible</Text>
          </Button>
        </View>
      </View>

      <Button onPress={handleUpdateProduct} loading={saving} style={{ marginTop: 24 }}>
        Enregistrer les modifications
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContainer: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb'
  },
  statusButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#374151'
  },
  availableButton: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  availableButtonText: {
    color: '#166534',
  },
  unavailableButton: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  unavailableButtonText: {
    color: '#991b1b',
  },
});
