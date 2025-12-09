import React from 'react';
import { Text as RNText, TextInput as RNTextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export const Text = ({ className, style, ...props }: any) => (
  <RNText {...props} style={[{ fontSize: 16 }, style]} />
);

export const Input = React.forwardRef<RNTextInput, any>(({ style, ...props }, ref) => (
  <RNTextInput ref={ref} {...props} style={[{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }, style]} />
));

export const Button = ({ children, onPress, disabled, loading, style }: any) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[{ backgroundColor: '#111', padding: 12, borderRadius: 10, alignItems: 'center' }, style]}>
    {loading ? <ActivityIndicator /> : <RNText style={{ color: 'white', fontWeight: '600' }}>{children}</RNText>}
  </TouchableOpacity>
);

export const Card = ({ children, style }: any) => (
  <View style={[{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12 }, style]}>{children}</View>
);
