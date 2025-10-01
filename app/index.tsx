import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigate = () => {
    router.push('/auth/login');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola Mundo!</Text>
      <Text style={styles.subtitle}>Tu proyecto limpio está listo</Text>
      {Platform.OS !== 'web' && (
        <Text onPress={handleNavigate}>Ir a autenticacion</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
