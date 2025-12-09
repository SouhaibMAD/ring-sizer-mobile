// src/screens/SizeCalculatorScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text as RNText,
  Platform, // ✅ nécessaire pour thumbTintColor
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ruler } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { Card } from '@/components/UI';

const ringSizes = [
  { diameter: 14.0, us: 3,   eu: 44, uk: 'F' },
  { diameter: 14.4, us: 3.5, eu: 45, uk: 'G' },
  { diameter: 14.8, us: 4,   eu: 46, uk: 'H' },
  { diameter: 15.3, us: 4.5, eu: 47, uk: 'I' },
  { diameter: 15.7, us: 5,   eu: 49, uk: 'J' },
  { diameter: 16.1, us: 5.5, eu: 50, uk: 'K' },
  { diameter: 16.5, us: 6,   eu: 51, uk: 'L' },
  { diameter: 16.9, us: 6.5, eu: 52, uk: 'M' },
  { diameter: 17.3, us: 7,   eu: 54, uk: 'N' },
  { diameter: 17.7, us: 7.5, eu: 55, uk: 'O' },
  { diameter: 18.2, us: 8,   eu: 57, uk: 'P' },
  { diameter: 18.6, us: 8.5, eu: 58, uk: 'Q' },
  { diameter: 19.0, us: 9,   eu: 59, uk: 'R' },
  { diameter: 19.4, us: 9.5, eu: 60, uk: 'S' },
  { diameter: 19.8, us: 10,  eu: 62, uk: 'T' },
];

const braceletSizes = [
  { circumference: 14, size: 'XS', label: 'Très petit' },
  { circumference: 15, size: 'S',  label: 'Petit' },
  { circumference: 16, size: 'M',  label: 'Moyen' },
  { circumference: 17, size: 'L',  label: 'Grand' },
  { circumference: 18, size: 'XL', label: 'Très grand' },
];

type TabKey = 'ring' | 'bracelet';

function closestRing(d: number) {
  return ringSizes.reduce((p, c) =>
    Math.abs(c.diameter - d) < Math.abs(p.diameter - d) ? c : p
  );
}
function closestBracelet(circ: number) {
  return braceletSizes.reduce((p, c) =>
    Math.abs(c.circumference - circ) < Math.abs(p.circumference - circ) ? c : p
  );
}

export default function SizeCalculatorScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [tab, setTab] = useState<TabKey>('ring');
  const [ringDiameter, setRingDiameter] = useState<number>(16.5);
  const [braceletCirc, setBraceletCirc] = useState<number>(16);

  const currentRing = useMemo(() => closestRing(ringDiameter), [ringDiameter]);
  const currentBracelet = useMemo(() => closestBracelet(braceletCirc), [braceletCirc]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: Math.max(tabBarHeight + 16, 80), // évite de passer sous la barre d’onglets
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#f59e0b', borderRadius: 14, padding: 16 }}>
          <RNText style={{ color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 6 }}>
            Calculateur de Taille
          </RNText>
          <RNText style={{ color: 'rgba(255,255,255,0.9)' }}>
            Trouvez votre taille parfaite
          </RNText>
        </View>

        <Card style={{ padding: 12 }}>
          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {(['ring', 'bracelet'] as TabKey[]).map((t) => {
              const active = tab === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTab(t)}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    paddingVertical: 10,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: active ? '#111' : '#e5e7eb',
                    backgroundColor: active ? '#111' : 'transparent',
                  }}
                >
                  <Ruler color={active ? '#fff' : '#111'} size={16} />
                  <RNText style={{ color: active ? '#fff' : '#111', fontWeight: '600' }}>
                    {t === 'ring' ? 'Bague' : 'Bracelet'}
                  </RNText>
                </Pressable>
              );
            })}
          </View>

          {tab === 'ring' ? (
            <View style={{ gap: 16 }}>
              <RNText style={{ marginBottom: 4, color: '#111' }}>Diamètre intérieur (mm)</RNText>

              {/* Aperçu bague */}
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 190 }}>
                <View
                  style={{
                    borderRadius: 9999,
                    borderWidth: 8,
                    borderColor: '#fbbf24',
                    width: Math.min(ringDiameter * 8, 220),
                    height: Math.min(ringDiameter * 8, 220),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  }}
                >
                  <RNText style={{ color: '#f59e0b', fontWeight: '600' }}>
                    {ringDiameter.toFixed(1)} mm
                  </RNText>
                </View>
              </View>

              {/* Slider bague */}
              <Slider
                minimumValue={14}
                maximumValue={20}
                step={0.1}
                value={ringDiameter}
                onValueChange={setRingDiameter} // ✅ pas d’annotation TS dans JSX
                minimumTrackTintColor="#fbbf24"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor={Platform.OS === 'android' ? '#fbbf24' : undefined}
              />

              {/* Résultat */}
              <Card style={{ padding: 12, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.10)' }}>
                <RNText style={{ fontWeight: '700', marginBottom: 8 }}>Votre taille</RNText>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <RNText style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>États-Unis</RNText>
                    <RNText>{currentRing.us}</RNText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <RNText style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Europe</RNText>
                    <RNText>{currentRing.eu}</RNText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <RNText style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>UK</RNText>
                    <RNText>{currentRing.uk}</RNText>
                  </View>
                </View>
              </Card>

              {/* Tableau des tailles */}
              <View>
                <RNText style={{ fontWeight: '700', marginBottom: 8 }}>Tableau des tailles</RNText>
                <View style={{ maxHeight: 260 }}>
                  <ScrollView>
                    {ringSizes.map((s, idx) => {
                      const active = s.diameter === currentRing.diameter;
                      return (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 10,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: active ? '#fbbf24' : '#e5e7eb',
                            backgroundColor: active ? 'rgba(251,191,36,0.20)' : 'transparent',
                            marginBottom: 8,
                          }}
                        >
                          <RNText style={{ fontSize: 14 }}>{s.diameter} mm</RNText>
                          <View style={{ flexDirection: 'row', gap: 12 }}>
                            <RNText>US: {s.us}</RNText>
                            <RNText>EU: {s.eu}</RNText>
                            <RNText>UK: {s.uk}</RNText>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              <RNText style={{ marginBottom: 4, color: '#111' }}>Tour de poignet (cm)</RNText>

              {/* Aperçu bracelet */}
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 150 }}>
                <View
                  style={{
                    borderRadius: 9999,
                    borderWidth: 12,
                    borderColor: '#fbbf24',
                    width: Math.min(braceletCirc * 10, 240),
                    height: Math.min(braceletCirc * 6, 160),
                    backgroundColor: 'transparent',
                  }}
                />
                <View style={{ position: 'absolute' }}>
                  <RNText style={{ color: '#f59e0b', fontWeight: '600' }}>{braceletCirc} cm</RNText>
                </View>
              </View>

              {/* Slider bracelet */}
              <Slider
                minimumValue={13}
                maximumValue={20}
                step={0.5}
                value={braceletCirc}
                onValueChange={setBraceletCirc} // ✅
                minimumTrackTintColor="#fbbf24"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor={Platform.OS === 'android' ? '#fbbf24' : undefined}
              />

              {/* Résultat */}
              <Card style={{ padding: 12, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.10)' }}>
                <RNText style={{ fontWeight: '700', marginBottom: 8 }}>Votre taille</RNText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <RNText style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Taille</RNText>
                    <RNText>{currentBracelet.size}</RNText>
                  </View>
                  <View>
                    <RNText style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Description</RNText>
                    <RNText>{currentBracelet.label}</RNText>
                  </View>
                </View>
              </Card>

              {/* Tableau des tailles */}
              <View>
                <RNText style={{ fontWeight: '700', marginBottom: 8 }}>Tableau des tailles</RNText>
                <View>
                  {braceletSizes.map((s, idx) => {
                    const active = s.circumference === currentBracelet.circumference;
                    return (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 12,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: active ? '#fbbf24' : '#e5e7eb',
                          backgroundColor: active ? 'rgba(251,191,36,0.20)' : 'transparent',
                          marginBottom: 8,
                        }}
                      >
                        <View>
                          <RNText>{s.size}</RNText>
                          <RNText style={{ color: '#6b7280', fontSize: 12 }}>{s.label}</RNText>
                        </View>
                        <RNText>{s.circumference} cm</RNText>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
