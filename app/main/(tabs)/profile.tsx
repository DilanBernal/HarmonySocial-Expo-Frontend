import ProfileImage from '@/components/general/profile-image';
import AuthUserService from '@/core/services/AuthUserService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { finalize } from 'rxjs';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [username, setUsername] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [learingPoints, setLearningPoints] = useState<number>(-1);
  const authUserService = new AuthUserService();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    authUserService.getIdSyncFromAsyncStorage();
    setTimeout(() => {
      authUserService
        .getDataInfoFromApi()
        .pipe(
          finalize(() => {
            setRefreshing(false);
          })
        )
        .subscribe({
          next(value) {
            setUsername(value.data.username);
            setProfileImage(value.data.profileImage);
            setMemberSince(String(value.data.activeFrom));
            setLearningPoints(value.data.learningPoints);
          },
        });
    }, 100);
  };

  useEffect(() => {
    const getUserData = async () => {
      const userStorage = await authUserService.getDataInfoFromAsyncStorage();
      console.log(userStorage);
      if (!userStorage) {
        onLogout();
        return;
      }
      try {
        const userJson = userStorage;
        console.log(userJson);
        setProfileImage(userJson.profileImage);
        setUsername(userJson.username || '');
        setMemberSince(userJson.activeFrom || '');
        setLearningPoints(userJson.learningPoints);
      } catch (error) {
        console.error(error);
        // Si hay error, forzar logout
        // onLogout();
      }
    };
    getUserData();
  }, []);

  const onLogout = async () => {
    await authUserService.logout();
    router.replace('/auth/login');
    // rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView
      contentContainerStyle={s.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={s.innerContainer}>
        <ProfileImage image={profileImage} imageStyle={s.avatar} />
        <Text style={s.name}>{username || 'Usuario'}</Text>
        <Text style={s.learningPoints}>
          Puntos de aprendizaje {learingPoints}
        </Text>
        {memberSince && (
          <Text style={s.muted}>Miembro desde {memberSince}</Text>
        )}

        <Pressable style={s.btn} onPress={onLogout}>
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
    height: ' 100%',
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
    verticalAlign: 'middle',
    alignContent: 'center',
    margin: 'auto',
  },
});
