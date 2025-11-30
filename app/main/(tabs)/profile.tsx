import ProfileImage from '@/components/general/profile-image';
import useProfileViewModel from '@/core/viewmodels/profile/profile-view-model';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * ProfileScreen - Uses ProfileViewModel for MVVM pattern compliance.
 * All business logic is handled by the ViewModel with RxJS.
 */
export default function ProfileScreen() {
  // Use the ViewModel for all state and logic
  const {
    profileImage,
    username,
    memberSince,
    learningPoints,
    isLoading,
    isRefreshing,
    errorMessage,
    refreshProfile,
    logout,
    clearError,
  } = useProfileViewModel();

  if (isLoading && !isRefreshing) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
        <Text style={s.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={s.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshProfile}
          tintColor="#7C4DFF"
        />
      }
    >
      {/* Error message display */}
      {errorMessage && (
        <Pressable onPress={clearError} style={s.errorBanner}>
          <Text style={s.errorText}>{errorMessage}</Text>
        </Pressable>
      )}

      <View style={s.innerContainer}>
        <ProfileImage image={profileImage} imageStyle={s.avatar} />
        <Text style={s.name}>{username || 'Usuario'}</Text>
        <Text style={s.learningPoints}>
          Puntos de aprendizaje {learningPoints}
        </Text>
        {memberSince && (
          <Text style={s.muted}>Miembro desde {memberSince}</Text>
        )}

        <Pressable style={s.btn} onPress={logout}>
          <Text style={s.btnText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c16',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0b0c16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#E6EAF2',
    marginTop: 12,
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    width: '90%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
  },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  name: { color: '#E6EAF2', fontSize: 20, fontWeight: '800' },
  muted: { color: '#9AA3B2', marginTop: 4, marginBottom: 24 },
  learningPoints: { color: '#9AA3B2' },
  btn: {
    marginTop: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: 'white', fontWeight: '800' },
  innerContainer: {
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
