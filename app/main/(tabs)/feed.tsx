import defaultColors from '@/assets/styles/colors/default';
import HomeHeader from '@/components/home/home-header';
import PostCard from '@/components/home/post-card';
import Post from '@/core/models/data/Post';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const FEED: Post[] = [];

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
