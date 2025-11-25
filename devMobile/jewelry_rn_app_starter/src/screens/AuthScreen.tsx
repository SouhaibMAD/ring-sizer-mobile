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
import { User, Store, Shield, LogOut } from 'lucide-react-native';
import { Card, Button, Input, Text } from '@/components/UI';
import { useAuth, Role } from '@/context/AuthContext';

export default function AuthScreen() {
  const nav = useNavigation<any>();
  const { user, login, logout, isAuthenticated } = useAuth();
  const previousAuthState = useRef(isAuthenticated);
  
  // Navigate based on user role after successful login (only when transitioning from unauthenticated to authenticated)
  useEffect(() => {
    // Only navigate non-vendors automatically
    if (isAuthenticated && user && !previousAuthState.current) {
      if (user.role === 'client') {
        nav.navigate('Home');
      }
      // vendors stay here, they can click the button manually
    }
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, user, nav]);
  

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [company, setCompany] = useState('');
  const [siret, setSiret] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      // Login with role validation - backend will check if user's role matches selected role
      await login(email, password, role);
      
      // Navigation will be handled by useEffect when user state updates
      // No need to navigate here - the useEffect will handle it based on actual user role
    } catch (e: any) {
      console.log('Auth error', e);
      // Error message is already formatted by AuthContext
      const errorMessage = e?.message || "Une erreur s'est produite lors de l'authentification.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // === Écran "Mon compte" quand l'utilisateur est déjà connecté ===
  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
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
              Mon Compte
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
              Gérez votre profil
            </Text>
          </View>

          <Card style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              {user.role === 'client' && <User color="#fbbf24" size={28} />}
              {user.role === 'vendor' && <Store color="#fbbf24" size={28} />}
              {user.role === 'admin' && <Shield color="#fbbf24" size={28} />}
              <View>
                <Text style={{ fontWeight: '700' }}>{user.email}</Text>
                <Text
                  style={{
                    opacity: 0.6,
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role}
                </Text>
              </View>
            </View>

            {user.role === 'vendor' && (
              <View
                style={{
                  gap: 6,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 12, opacity: 0.6 }}>ID Vendeur</Text>
                <Text>{user.vendorId}</Text>
              </View>
            )}

            <Button
              variant="outline"
              onPress={() => {
                logout();
                nav.navigate('Home');
              }}
              style={{ marginTop: 16 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <LogOut size={16} />
                <Text>Se déconnecter</Text>
              </View>
            </Button>
          </Card>

          {user.role === 'vendor' && (
            <Button
              onPress={() => nav.navigate('VendorDashboard')}
              style={{ backgroundColor: '#fbbf24' }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Store size={16} />
                <Text style={{ color: 'black' }}>
                  Tableau de bord vendeur
                </Text>
              </View>
            </Button>
          )}

          {user.role === 'admin' && (
            <Button
              onPress={() => nav.navigate('AdminDashboard')}
              style={{ backgroundColor: '#fbbf24' }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Shield size={16} />
                <Text style={{ color: 'black' }}>Dashboard admin</Text>
              </View>
            </Button>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // === Écran de connexion / inscription ===
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
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
              Connexion
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
              Accédez à votre compte
            </Text>
          </View>

          <Card style={{ padding: 16 }}>
            {/* Onglets Connexion / Inscription */}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 16,
              }}
            >
              {(['login', 'register'] as const).map((t) => {
                const active = tab === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setTab(t)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: active ? '#111' : '#e5e7eb',
                      backgroundColor: active ? '#111' : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: active ? '#fff' : '#111',
                        fontWeight: '600',
                      }}
                    >
                      {t === 'login' ? 'Connexion' : 'Inscription'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ gap: 12 }}>
              {error && (
                <Text style={{ color: 'red', marginBottom: 4 }}>
                  {error}
                </Text>
              )}

              <View>
                <Text style={{ marginBottom: 6 }}>Email</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="vous@email.fr"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 6 }}>Mot de passe</Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />
              </View>

              {/* Choix du type de compte */}
              <View style={{ gap: 8 }}>
                <Text>Type de compte</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['client', 'vendor', 'admin'] as Role[]).map((r) => {
                    const active = role === r;
                    const Icon =
                      r === 'client' ? User : r === 'vendor' ? Store : Shield;

                    return (
                      <Pressable
                        key={r}
                        onPress={() => setRole(r)}
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          paddingVertical: 10,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: active ? '#111' : '#e5e7eb',
                          backgroundColor: active ? '#fbbf24' : 'transparent',
                        }}
                      >
                        <Icon
                          size={16}
                          color={active ? 'black' : '#111'}
                        />
                        <RNText
                          style={{ color: active ? 'black' : '#111' }}
                        >
                          {r === 'client'
                            ? 'Client'
                            : r === 'vendor'
                            ? 'Vendeur'
                            : 'Admin'}
                        </RNText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Champs supplémentaires pour inscription vendeur */}
              {tab === 'register' && role === 'vendor' && (
                <View style={{ gap: 12 }}>
                  <View>
                    <Text style={{ marginBottom: 6 }}>
                      Nom de l'entreprise
                    </Text>
                    <Input
                      value={company}
                      onChangeText={setCompany}
                      placeholder="Bijouterie Exemple"
                    />
                  </View>
                  <View>
                    <Text style={{ marginBottom: 6 }}>SIRET</Text>
                    <Input
                      value={siret}
                      onChangeText={setSiret}
                      placeholder="123 456 789 00012"
                    />
                  </View>
                </View>
              )}

              {/* Bouton principal */}
              <Button
                onPress={submit}
                disabled={loading}
                style={{
                  backgroundColor: '#fbbf24',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ color: 'black' }}>
                  {loading
                    ? 'Veuillez patienter...'
                    : tab === 'login'
                    ? 'Se connecter'
                    : "S'inscrire"}
                </Text>
              </Button>

              {tab === 'login' && (
                <Pressable
                  onPress={() => {}}
                  style={{ alignItems: 'center', paddingVertical: 8 }}
                >
                  <Text style={{ opacity: 0.7 }}>
                    Mot de passe oublié ?
                  </Text>
                </Pressable>
              )}
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
