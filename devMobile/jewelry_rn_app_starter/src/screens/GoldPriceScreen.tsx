// src/screens/GoldPriceScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text as RNText,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react-native';
import Svg, { Polyline, Line, Circle } from 'react-native-svg';
import { Card, Button } from '@/components/UI';

// --- Données identiques au web ---
const mockData = {
  day: [
    { time: '00:00', price: 58.2 },
    { time: '04:00', price: 58.5 },
    { time: '08:00', price: 58.8 },
    { time: '12:00', price: 59.1 },
    { time: '16:00', price: 58.9 },
    { time: '20:00', price: 59.3 },
  ],
  week: [
    { time: 'Lun', price: 57.5 },
    { time: 'Mar', price: 58.0 },
    { time: 'Mer', price: 58.3 },
    { time: 'Jeu', price: 58.8 },
    { time: 'Ven', price: 59.1 },
    { time: 'Sam', price: 59.0 },
    { time: 'Dim', price: 59.3 },
  ],
  month: [
    { time: 'S1', price: 56.8 },
    { time: 'S2', price: 57.2 },
    { time: 'S3', price: 57.8 },
    { time: 'S4', price: 59.3 },
  ],
} as const;

type Period = keyof typeof mockData;

export default function GoldPriceScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [period, setPeriod] = useState<Period>('day');

  // Même logique que le web
  const currentPrice = 59.3;
  const previousPrice = 58.8;
  const change = currentPrice - previousPrice;
  const changePercent = ((change / previousPrice) * 100).toFixed(2);
  const isPositive = change >= 0;

  // Mise en forme de la date (FR)
  const nowLabel =
    typeof Intl !== 'undefined' && (Intl as any).DateTimeFormat
      ? new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date())
      : new Date().toLocaleString();

  // --- Chart minimal en SVG (ligne + points) ---
  const { points, minY, maxY, xLabels } = useMemo(() => {
    const data = mockData[period];
    const w = Dimensions.get('window').width - 32 /* padding horizontal */;
    const width = Math.max(260, w); // garde une largeur min
    const height = 220;
    const padX = 16;
    const padY = 16;

    const prices = data.map((d) => d.price);
    const dMin = Math.min(...prices);
    const dMax = Math.max(...prices);
    // marges verticales comme sur le web: dataMin-1, dataMax+1
    const min = Math.floor(dMin - 1);
    const max = Math.ceil(dMax + 1);

    const scaleX = (i: number) => {
      if (data.length === 1) return padX + (width - 2 * padX) / 2;
      return padX + (i * (width - 2 * padX)) / (data.length - 1);
    };
    const scaleY = (p: number) => {
      const t = (p - min) / (max - min || 1);
      // y inversé (0 en haut)
      return height - padY - t * (height - 2 * padY);
    };

    const pts = data.map((d, i) => `${scaleX(i)},${scaleY(d.price)}`).join(' ');
    const labels = data.map((d) => d.time);

    return { points: pts, minY: min, maxY: max, xLabels: labels };
  }, [period]);

  // Segment/Tabs (Jour/Semaine/Mois)
  const tabs: { key: Period; label: string }[] = [
    { key: 'day', label: 'Jour' },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: Math.max(tabBarHeight + 16, 80),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header (dégradé proche du web) */}
        <View
          style={{
            backgroundColor: '#f59e0b',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <RNText style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>
            Prix de l'Or
          </RNText>
          <RNText style={{ color: 'rgba(255,255,255,0.9)' }}>En temps réel</RNText>
        </View>

        {/* Carte Prix Actuel */}
        <Card style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <RNText style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Prix actuel</RNText>
              <RNText style={{ fontSize: 28, fontWeight: '800', color: '#fbbf24' }}>
                {currentPrice.toFixed(2)} €
              </RNText>
              <RNText style={{ fontSize: 13, color: '#6b7280' }}>par gramme</RNText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
              }}
            >
              {isPositive ? (
                <TrendingUp color="#16a34a" size={18} />
              ) : (
                <TrendingDown color="#dc2626" size={18} />
              )}
              <RNText style={{ color: isPositive ? '#166534' : '#991b1b', fontWeight: '700' }}>
                {isPositive ? '+' : ''}
                {changePercent}%
              </RNText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Clock color="#6b7280" size={16} />
            <RNText style={{ color: '#6b7280', fontSize: 13 }}>Mis à jour : {nowLabel}</RNText>
          </View>
        </Card>

        {/* Carte Graphique */}
        <Card style={{ padding: 12, marginTop: 12 }}>
          <RNText style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
            Tendance du prix
          </RNText>

          {/* Tabs (Jour / Semaine / Mois) */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {tabs.map((t) => {
              const active = period === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setPeriod(t.key)}
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
                  <RNText style={{ color: active ? '#fff' : '#111', fontWeight: '600' }}>
                    {t.label}
                  </RNText>
                </Pressable>
              );
            })}
          </View>

          {/* Graph (ligne + points) */}
          <View style={{ height: 220, width: '100%' }}>
            <Svg width="100%" height="100%">
              {/* lignes horizontales (grid light) */}
              {[0, 1, 2, 3].map((i) => (
                <Line
                  key={i}
                  x1="0%"
                  x2="100%"
                  y1={`${(i + 1) * 20 + 20}%`}
                  y2={`${(i + 1) * 20 + 20}%`}
                  stroke="#eee"
                  strokeDasharray="3,3"
                />
              ))}

              {/* polyline de la série */}
              <Polyline
                points={points}
                stroke="#fbbf24"
                strokeWidth={2}
                fill="none"
              />

              {/* points */}
              {mockData[period].map((d, idx) => {
                // on recalcule les coords à partir de la string "points"
                // plus simple: on split et prend l’index
                const coords = points.split(' ')[idx]?.split(',');
                if (!coords || coords.length !== 2) return null;
                const [cx, cy] = coords;
                return <Circle key={idx} cx={cx} cy={cy} r="3.5" fill="#fbbf24" />;
              })}
            </Svg>
          </View>

          {/* Légendes X (simplifiées) */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              paddingHorizontal: 4,
            }}
          >
            {mockData[period].map((d, i) => (
              <RNText key={i} style={{ color: '#6b7280', fontSize: 12 }}>
                {d.time}
              </RNText>
            ))}
          </View>

          {/* Bornes Y (dataMin - 1 / dataMax + 1) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <RNText style={{ color: '#6b7280', fontSize: 12 }}>{minY} €</RNText>
            <RNText style={{ color: '#6b7280', fontSize: 12 }}>{maxY} €</RNText>
          </View>
        </Card>

        {/* Info */}
        <Card style={{ padding: 12, marginTop: 12, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <RNText style={{ fontSize: 15, fontWeight: '700', color: '#1e3a8a', marginBottom: 6 }}>
            Devise
          </RNText>
          <RNText style={{ color: '#1d4ed8' }}>
            Les prix sont affichés en Euros (EUR) et représentent le cours de l'or pur à 24 carats.
          </RNText>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
