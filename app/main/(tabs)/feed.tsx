import defaultColors from '@/assets/styles/colors/default';
import HomeHeader from '@/components/home/home-header';
import PostCard from '@/components/home/post-card';
import Post from '@/core/models/data/Post';
import User from '@/core/models/data/User';
import resolveImage from '@/core/utils/resolveImage';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const FRIENDS: User[] = [
  {
    id: 's1',
    full_name: 'Chinacota',
    email: 'chinacota@example.com',
    username: 'chinacota',
    password: '',
    profile_image: 'avatar4', // default local avatar key
  },
  {
    id: 's2',
    full_name: 'Sarah',
    email: 'sarah@example.com',
    username: 'sarah',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80',
    },
  },
  {
    id: 's3',
    full_name: 'Daniel',
    email: 'daniel@example.com',
    username: 'daniel',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=256&q=80',
    },
  },
  {
    id: 's4',
    full_name: 'Leo',
    email: 'leo@example.com',
    username: 'leo',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80',
    },
  },
];

const FEED: Post[] = [
  {
    id: '1',
    user: 'Chinacota',
    songId: 1,
    avatar: resolveImage(FRIENDS[0]?.profile_image),
    time: '2 h',
    title: 'Night Drive',
    artist: 'Midnight Crew',
    cover: require('@/assets/images/imgmusica.jpg'),
    likes: 128,
    comments: 24,
  },
  {
    id: '2',
    user: 'Luisa',
    songId: 2,
    avatar: resolveImage(FRIENDS[1].profile_image),
    time: '5 h',
    title: 'Ocean Eyes',
    artist: 'Blue Coast',
    cover: {
      uri: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80',
    },
    likes: 84,
    comments: 10,
  },
];

const FeedScreen = () => {
  const header = useMemo(() => <HomeHeader />, []);

  return (
    <View style={styles.homeContainer}>
      <FlatList
        style={{ flex: 1, backgroundColor: '#0b0c16' }}
        data={FEED}
        ListHeaderComponent={header}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => <PostCard p={item} />}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: defaultColors.background,
  },
});

export default FeedScreen;
