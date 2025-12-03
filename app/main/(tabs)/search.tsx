import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SectionList,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import SearchBar from '@/components/general/search-bar';
import useSearchViewModel from '@/core/viewmodels/search/search-view-model';
import User from '@/core/models/data/User';
import Artist from '@/core/models/data/Artist';
import { Song } from '@/core/models/data/Song';
import ProfileImage from '@/components/general/profile-image';
import UserBasicData from '@/core/dtos/user/UserBasicData';

type Section =
  | { title: 'Usuarios'; type: 'users'; data: User[] }
  | { title: 'Artistas'; type: 'artists'; data: Artist[] }
  | { title: 'Canciones'; type: 'songs'; data: Song[] };

/**
 * SearchScreen - Uses SearchViewModel for MVVM pattern compliance.
 * All business logic is handled by the ViewModel with RxJS optimization.
 */
export default function SearchScreen() {

  const router = useRouter();

  // Use the ViewModel for all state and logic
  const {
    query,
    isLoading,
    errorMessage,
    results,
    onQueryChange,
    clearSearch,
    clearError,
  } = useSearchViewModel();

  const sections: Section[] = useMemo(
    () => [
      { title: 'Usuarios', type: 'users', data: results.users },
      { title: 'Artistas', type: 'artists', data: results.artists },
      { title: 'Canciones', type: 'songs', data: results.songs },
    ],
    [results]
  );

  const userIcon =
    'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png';
  const artistIcon =
    'https://img.freepik.com/vector-premium/logotipo-abstracto-musica-ilustracion-icono-identidad-marca_7109-917.jpg';
  const songIcon =
    'https://previews.123rf.com/images/butenkow/butenkow1711/butenkow171100727/90745568-vector-logo-music.jpg';

  const headerIcon = (type: Section['type']) => {
    const uri =
      type === 'users' ? userIcon : type === 'artists' ? artistIcon : songIcon;
    return (
      <Image
        source={{ uri }}
        style={{
          width: 16,
          height: 16,
          marginRight: 8,
          borderRadius: type === 'songs' ? 3 : 8,
        }}
      />
    );
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 6,
        marginHorizontal: 12,
      }}
    >
      {headerIcon(section.type)}
      <Text style={{ color: '#9aa3b2' }}>{section.title}</Text>
    </View>
  );

  const renderSectionFooter = ({ section }: { section: Section }) =>
    section.data.length === 0 ? (
      <Text
        style={{
          color: '#667085',
          marginHorizontal: 12,
          marginBottom: 8,
          fontSize: 12,
        }}
      >
        Sin resultados en esta sección
      </Text>
    ) : null;

  const renderItem = ({ item, section }: { item: any; section: Section }) => {
    if (section.type === 'songs') {
      const s = item as Song;
      function playSong(arg0: { title: string; audioUrl: string }): void {
        throw new Error('Function not implemented.');
      }

      return (
        <Pressable
          onPress={() => playSong({ title: s.title, audioUrl: s.audioUrl })}
        >
          <View
            style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
          >
            <Image
              source={{ uri: s.artwork || songIcon }}
              style={{ width: 44, height: 44, borderRadius: 6 }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {s.title}
              </Text>
              {!!s.artist && (
                <Text style={{ color: '#9aa3b2', marginTop: 2 }}>
                  {s.artist}
                </Text>
              )}
            </View>
            <Text style={{ color: '#4f46e5' }}>Reproducir</Text>
          </View>
        </Pressable>
      );
    }

    if (section.type === 'artists') {
      const a = item as Artist;
      return (
        <Pressable
          onPress={() => router.navigate('/main/library')}
        >
          <View
            style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
          >
            <Image
              source={{ uri: artistIcon }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <Text style={{ color: '#fff', marginLeft: 10, fontWeight: '600' }}>
              {a.nombre}
            </Text>
          </View>
        </Pressable >
      );
    }

    const u = item as UserBasicData;
    return (
      <Pressable onPress={() => {
        console.log("Mandando a la ruta")
        router.navigate({ pathname: "/main/user-info/[id]", params: { id: u.username } }, {})
      }}>
        <View
          style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
        >
          <ProfileImage image={u.profileImageUrl} imageStyle={{ width: 44, height: 44, borderRadius: 22 }} />
          <Text style={{ color: '#fff', marginLeft: 10, fontWeight: '600' }}>
            {u.username}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0c16', top: 35 }}>
      <View style={{ padding: 12 }}>
        <SearchBar
          value={query}
          onChangeText={onQueryChange}
          onClear={clearSearch}
          autoFocus
        />
      </View>

      {/* Error message display */}
      {errorMessage && (
        <Pressable onPress={clearError} style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              borderWidth: 1,
              borderColor: '#EF4444',
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: '#EF4444', fontSize: 12 }}>
              {errorMessage}
            </Text>
          </View>
        </Pressable>
      )}

      {!query.length ? (
        <View>{/* Placeholder for stories or suggestions */}</View>
      ) : isLoading ? (
        <View style={{ paddingTop: 24, alignItems: 'center' }}>
          <ActivityIndicator color="#7C4DFF" />
          <Text style={{ color: '#9aa3b2', marginTop: 8 }}>
            Buscando "{query}"…
          </Text>
        </View>
      ) : (
        <Link href={'/main/(tabs)/library'} asChild>
          <SectionList<any, any>
            sections={sections}
            keyExtractor={(item: any, idx) =>
              String(item.id || item.title || idx)
            }
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            renderSectionFooter={renderSectionFooter}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        </Link>
      )}
    </View>
  );
}
