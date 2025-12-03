import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MultiStepPostForm } from '@/components/post/MultiStepPostForm';

const CreatePostScreen = () => {
  const router = useRouter();

  const handleSuccess = () => {
    console.log('[CreatePostScreen] Post created successfully, navigating back');
    // Navigate back to the feed or previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Crear Nuevo Post</Text>
              <Text style={styles.subtitle}>
                Comparte tu música, ideas o contenido con la comunidad {'\u{1F3B5}'}
              </Text>
            </View>

            {/* Form */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <MultiStepPostForm onSuccess={handleSuccess} />
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c16',
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1b1f27e6',
    borderColor: '#ffffff22',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    minHeight: 600,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: '#E6EAF2',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#A8B0C3',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
