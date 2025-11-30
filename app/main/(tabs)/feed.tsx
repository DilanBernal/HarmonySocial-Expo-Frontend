import defaultColors from '@/assets/styles/colors/default';
import HomeHeader from '@/components/home/home-header';
import PostCard from '@/components/home/post-card';
import useFeedViewModel from '@/core/viewmodels/feed/feed-view-model';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * FeedScreen - Uses FeedViewModel for MVVM pattern compliance.
 * All business logic is handled by the ViewModel.
 */
const FeedScreen = () => {
  const {
    posts,
    isLoading,
    isRefreshing,
    errorMessage,
    refreshFeed,
    isFeedEmpty,
  } = useFeedViewModel();

  const header = useMemo(() => <HomeHeader />, []);

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
        <Text style={styles.loadingText}>Cargando feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.homeContainer}>
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      <FlatList
        style={{ flex: 1, backgroundColor: '#0b0c16' }}
        data={posts}
        ListHeaderComponent={header}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => <PostCard p={item} />}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeed}
            tintColor="#7C4DFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay publicaciones en tu feed aún.
            </Text>
            <Text style={styles.emptySubtext}>
              ¡Sigue a otros usuarios para ver su contenido!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: defaultColors.background,
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
    borderBottomWidth: 1,
    borderBottomColor: '#EF4444',
    padding: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    color: '#E6EAF2',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#9AA3B2',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default FeedScreen;
