import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SectionList,
  Text,
  View,
} from 'react-native';

import SearchBar from '@/components/general/search-bar';
// import StoriesRow from '../../components/general/StoriesRow';
// import { playSong } from '../../core/player/playerSetup';
import {
  SearchArtist,
  SearchResponse,
  searchService,
  SearchSong,
  SearchUser,
} from '@/core/services/search/search-service';

function debounce<F extends (...args: any[]) => void>(fn: F, wait: number) {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

type Section =
  | { title: 'Usuarios'; type: 'users'; data: SearchUser[] }
  | { title: 'Artistas'; type: 'artists'; data: SearchArtist[] }
  | { title: 'Canciones'; type: 'songs'; data: any };

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<SearchResponse>({
    users: [],
    artists: [],
    songs: [],
  });

  const stories = [
    {
      id: '1',
      name: 'Chinacota',
      avatarUrl: 'https://i.pravatar.cc/100?img=10',
    },
    { id: '2', name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/100?img=12' },
    { id: '3', name: 'Daniel', avatarUrl: 'https://i.pravatar.cc/100?img=13' },
  ];

  const doSearch = async (text: string) => {
    const t = text.trim();
    if (!t) {
      setRes({ users: [], artists: [], songs: [] });
      return;
    }
    setLoading(true);
    try {
      searchService.searchAll(t).subscribe((r) => {
        console.log(r);
        setRes(r);
      });
    } catch (e) {
      console.log('[Search] error', e);
      setRes({ users: [], artists: [], songs: [] });
    } finally {
      setLoading(false);
    }
  };

  const debounced = useRef(debounce(doSearch, 300)).current;
  const onChange = (t: string) => {
    setQ(t);
    !t.trim() ? setRes({ users: [], artists: [], songs: [] }) : debounced(t);
  };

  const sections: Section[] = useMemo(
    () => [
      { title: 'Usuarios', type: 'users', data: res.users },
      { title: 'Artistas', type: 'artists', data: res.artists },
      { title: 'Canciones', type: 'songs', data: res.songs },
    ],
    [res]
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
      const s = item as SearchSong;
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
      const a = item as SearchArtist;
      return (
        <Pressable
          onPress={() => nav.navigate('ArtistProfile', { artistId: a.id })}
        >
          <View
            style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
          >
            <Image
              source={{ uri: a.avatarUrl || artistIcon }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <Text style={{ color: '#fff', marginLeft: 10, fontWeight: '600' }}>
              {a.name}
            </Text>
          </View>
        </Pressable>
      );
    }

    const u = item as SearchUser;
    return (
      <Pressable onPress={() => nav.navigate('UserProfile', { userId: u.id })}>
        <View
          style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
        >
          <Image
            source={{ uri: u.avatarUrl || userIcon }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <Text style={{ color: '#fff', marginLeft: 10, fontWeight: '600' }}>
            {u.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0c16', top: 35 }}>
      <View style={{ padding: 12 }}>
        <SearchBar
          value={q}
          onChangeText={onChange}
          onClear={() => {
            setQ('');
            setRes({ users: [], artists: [], songs: [] });
          }}
          autoFocus
        />
      </View>

      {!q.length ? (
        <View>{/* <StoriesRow data={stories} /> */}</View>
      ) : loading ? (
        <View style={{ paddingTop: 24, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ color: '#9aa3b2', marginTop: 8 }}>
            Buscando “{q}”…
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item: any, idx) =>
            String(item.id || item.title || idx)
          }
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}
