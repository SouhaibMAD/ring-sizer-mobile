// src/screens/AuthScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text as RNText,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Store, Shield, LogOut, Phone } from 'lucide-react-native';
import { Card, Button, Input, Text } from '@/components/UI';
import { useAuth, Role } from '@/context/AuthContext';

export default function AuthScreen() {
  const nav = useNavigation<any>();
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const previousAuthState = useRef(isAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated && user && !previousAuthState.current) {
      if (user.role === 'vendor') {
        nav.navigate('VendorDashboard');
      } else if (user.role === 'admin') {
        nav.navigate('AdminDashboard');
      }
    }
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, user, nav]);
  

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('vendor');
  const [company, setCompany] = useState('');
  const [siret, setSiret] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password, role);
      } else {
        await register({ email, password, role, company, siret, phone });
      }
    } catch (e: any) {
      console.log('Auth error', e);
      const errorMessage = e?.message || "Une erreur s'est produite lors de l'authentification.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <View style={{ backgroundColor: '#f59e0b', borderRadius: 14, padding: 16 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 6 }}>Mon Compte</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Gérez votre profil</Text>
          </View>

          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {user.role === 'vendor' && <Store color="#fbbf24" size={28} />}
              {user.role === 'admin' && <Shield color="#fbbf24" size={28} />}
              <View>
                <Text style={{ fontWeight: '700' }}>{user.email}</Text>
                <Text style={{ opacity: 0.6, textTransform: 'capitalize' }}>{user.role}</Text>
              </View>
            </View>

            {user.role === 'vendor' && (
              <View style={{ gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <Text style={{ fontSize: 12, opacity: 0.6 }}>ID Vendeur</Text>
                <Text>{user.vendorId}</Text>
              </View>
            )}

            <Button 
              variant="outline" 
              onPress={() => { logout(); nav.navigate('Home'); }} 
              style={{ marginTop: 16, borderColor: '#ef4444' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <LogOut size={16} color="#ef4444" />
                <Text style={{ color: '#ef4444' }}>Se déconnecter</Text>
              </View>
            </Button>
          </Card>

          {user.role === 'vendor' && (
            <Button onPress={() => nav.navigate('VendorDashboard')} style={{ backgroundColor: '#fbbf24' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Store size={16} color="black" />
                <Text style={{ color: 'black' }}>Tableau de bord vendeur</Text>
              </View>
            </Button>
          )}

          {user.role === 'admin' && (
            <Button onPress={() => nav.navigate('AdminDashboard')} style={{ backgroundColor: '#fbbf24' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Shield size={16} color="black" />
                <Text style={{ color: 'black' }}>Dashboard admin</Text>
              </View>
            </Button>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <View style={{ backgroundColor: '#f59e0b', borderRadius: 14, padding: 16 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 6 }}>
              {tab === 'login' ? 'Connexion' : 'Inscription'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Accédez à votre compte vendeur ou admin</Text>
          </View>

          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {(['login', 'register'] as const).map((t) => {
                const active = tab === t;
                return (
                  <Pressable key={t} onPress={() => setTab(t)} style={{ flex: 1, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: active ? '#111' : '#e5e7eb', backgroundColor: active ? '#111' : 'transparent', alignItems: 'center' }}>
                    <Text style={{ color: active ? '#fff' : '#111', fontWeight: '600' }}>
                      {t === 'login' ? 'Connexion' : 'Inscription'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ gap: 12 }}>
              {error && <Text style={{ color: 'red', marginBottom: 4 }}>{error}</Text>}

              <View>
                <Text style={{ marginBottom: 6 }}>Email</Text>
                <Input value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="vous@email.fr" />
              </View>

              <View>
                <Text style={{ marginBottom: 6 }}>Mot de passe</Text>
                <Input value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
              </View>

              <View style={{ gap: 8 }}>
                <Text>Type de compte</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['vendor', 'admin'] as Role[]).map((r) => {
                    const active = role === r;
                    const Icon = r === 'vendor' ? Store : Shield;
                    return (
                      <Pressable key={r} onPress={() => setRole(r)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: active ? '#111' : '#e5e7eb', backgroundColor: active ? '#fbbf24' : 'transparent' }}>
                        <Icon size={16} color={active ? 'black' : '#111'} />
                        <RNText style={{ color: active ? 'black' : '#111' }}>{r === 'vendor' ? 'Vendeur' : 'Admin'}</RNText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {tab === 'register' && role === 'vendor' && (
                <View style={{ gap: 12 }}>
                  <View>
                    <Text style={{ marginBottom: 6 }}>Nom de l'entreprise</Text>
                    <Input value={company} onChangeText={setCompany} placeholder="Bijouterie Exemple" />
                  </View>
                  <View>
                    <Text style={{ marginBottom: 6 }}>Téléphone</Text>
                    <Input value={phone} onChangeText={setPhone} placeholder="06 00 00 00 00" keyboardType="phone-pad" />
                  </View>
                  <View>
                    <Text style={{ marginBottom: 6 }}>SIRET</Text>
                    <Input value={siret} onChangeText={setSiret} placeholder="12345678" />
                  </View>
                </View>
              )}

              <Button onPress={submit} disabled={loading} style={{ backgroundColor: '#fbbf24', opacity: loading ? 0.7 : 1, marginTop: 10 }}>
                <Text style={{ color: 'black' }}>
                  {loading ? 'Veuillez patienter...' : tab === 'login' ? 'Se connecter' : "S'inscrire"}
                </Text>
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
