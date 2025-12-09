// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { House, Ruler, DollarSign, User } from 'lucide-react-native';

// === Importations avec alias @ ===
import HomeScreen from '@/screens/HomeScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import GoldPriceScreen from '@/screens/GoldPriceScreen';
import SizeCalculatorScreen from '@/screens/SizeCalculatorScreen';
import AuthScreen from '@/screens/AuthScreen';
import VendorDashboardScreen from '@/screens/VendorDashboardScreen';
import ProductManagementScreen from '@/screens/ProductManagementScreen';
import AddProductScreen from '@/screens/AddProductScreen';
import EditProductScreen from '@/screens/EditProductScreen';
import AdminDashboardScreen from '@/screens/AdminDashboardScreen';
import VendorManagementScreen from '@/screens/VendorManagementScreen';
import { AuthProvider } from '@/context/AuthContext';

// --- Types de navigation
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { id: string };
  VendorDashboard: undefined;
  ProductManagement: undefined;
  AddProduct: undefined;
  EditProduct: { productId: number };
  AdminDashboard: undefined;
  VendorManagement: undefined;
};

export type TabParamList = {
  Home: undefined;
  GoldPrice: undefined;
  SizeCalculator: undefined;
  Auth: undefined;
};

// --- Initialisation des navigateurs
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// --- Barre d’onglets principale
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0.5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="GoldPrice"
        component={GoldPriceScreen}
        options={{
          tabBarLabel: "Prix de l'Or",
          tabBarIcon: ({ color, size }) => <DollarSign color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SizeCalculator"
        component={SizeCalculatorScreen}
        options={{
          tabBarLabel: 'Tailles',
          tabBarIcon: ({ color, size }) => <Ruler color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          tabBarLabel: 'Compte',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// --- Application principale
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: 'Détail du produit' }}
          />
          <Stack.Screen
            name="VendorDashboard"
            component={VendorDashboardScreen}
            options={{ title: 'Espace Vendeur' }}
          />
          <Stack.Screen
            name="ProductManagement"
            component={ProductManagementScreen}
            options={{ title: 'Gestion Produits' }}
          />
          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ title: 'Ajouter un produit' }}
          />
          <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ title: 'Modifier le produit' }}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{ title: 'Admin' }}
          />
          <Stack.Screen
            name="VendorManagement"
            component={VendorManagementScreen}
            options={{ title: 'Vendeurs' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
