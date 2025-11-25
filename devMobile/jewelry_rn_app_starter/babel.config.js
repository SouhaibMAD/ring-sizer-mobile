module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: { '@': './src', '@assets': './assets' },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
      // ⚠️ Laisser CE plugin en dernier
      'react-native-reanimated/plugin',
    ],
  };
};
