import User from '@/core/models/data/User';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// import Post from '../../core/models/Post';
import defaultColors from '@/assets/styles/colors/default';
import ProfileImage from '@/components/general/profile-image';
import { useRouter } from 'expo-router';

const FRIENDS: Omit<User, 'password' | 'email'>[] = [];

// const PLAYLISTS: Playlist[] = [
//   {
//     id: 'p1',
//     title: 'Mezcla diaria',
//     cover: {
//       uri: '.',
//     },
//   },
//   {
//     id: 'p2',
//     title: 'Lo-Fi Beats',
//     cover: {
//       uri: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
//     },
//   },
//   {
//     id: 'p3',
//     title: 'Éxitos Latinos',
//     cover: {
//       uri: 'https://images.unsplash.com/photo-1499428665502-503f6c608263?w=800&q=80',
//     },
//   },
// ];

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const HomeHeader = () => {
  const router = useRouter();
  const greet = useGreeting();

  return (
    <View>
      <View style={s.topbar}>
        <Text style={s.logoText}>Harmony</Text>
      </View>

      {/* Saludo */}
      <Text style={s.greeting}>{greet} 👋</Text>
      <Text style={s.subtitle}>
        Explora música nueva y lo que comparten tus amigos.
      </Text>

      {/* Historias */}
      <Text style={s.sectionTitle}>Historias</Text>
      <FlatList
        data={FRIENDS}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <Pressable android_ripple={{ color: '#ffffff22', borderless: true }}>
            <LinearGradient colors={['#7C4DFF', '#4C63F2']} style={s.storyRing}>
              <ProfileImage
                image={item.profile_image}
                onPress={() => router.navigate('/main/profile')}
                imageStyle={s.storyImg}
              />
            </LinearGradient>
            <Text numberOfLines={1} style={s.storyName}>
              {item.full_name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default HomeHeader;

const s = StyleSheet.create({
  topbar: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    color: '#E6EAF2',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatar: { width: 34, height: 34, borderRadius: 17 },

  greeting: {
    color: '#E6EAF2',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  subtitle: {
    color: '#A8B0C3',
    fontSize: 13,
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 12,
  },

  searchWrap: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a1f28',
    borderWidth: 1,
    borderColor: defaultColors.borderDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, color: '#DDE3F0', paddingVertical: 0 },

  sectionTitle: {
    color: '#E6EAF2',
    fontWeight: '800',
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },

  /* historias */
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 999,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImg: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#222',
  },
  storyName: {
    color: '#C8CFDD',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    width: 64,
  },

  /* playlists */
  plItem: { width: 160, height: 120, borderRadius: 14, overflow: 'hidden' },
  plImage: { width: '100%', height: '100%', borderRadius: 14 },
  plOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 14,
  },
  plTitle: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    color: '#F1F4FF',
    fontWeight: '800',
  },

  text: { color: '#E6EAF2', fontSize: 20, fontWeight: '700' },
});
