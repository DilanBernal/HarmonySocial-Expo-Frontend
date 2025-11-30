import useLibraryViewModel from '@/core/viewmodels/library/library-view-model';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * LibraryScreen - Uses LibraryViewModel for MVVM pattern compliance.
 * All business logic is handled by the ViewModel with RxJS.
 */
export default function LibraryScreen() {
  const insets = useSafeAreaInsets();

  // Use the ViewModel for all state and logic
  const {
    songs,
    isLoading,
    isRefreshing,
    errorMessage,
    isLibraryEmpty,
    refreshLibrary,
    retry,
  } = useLibraryViewModel();

  if (isLoading && !isRefreshing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator color="#7C4DFF" />
        <Text style={{ color: '#fff', marginTop: 8 }}>
          Cargando tu biblioteca…
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
          padding: 16,
        }}
      >
        <Text style={{ color: '#fff', marginBottom: 12, textAlign: 'center' }}>
          {errorMessage}
        </Text>
        <Pressable
          onPress={retry}
          style={{ padding: 10, backgroundColor: '#4f46e5', borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (isLibraryEmpty()) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <Text style={{ color: '#fff' }}>Aún no tienes canciones subidas</Text>
      </View>
    );
  }

  function playSongByBlob(arg0: { blobName: string; title: string }): void {
    // TODO: Implement player functionality
    console.log('[LibraryScreen] Play song:', arg0);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b0c16',
        paddingTop: insets.top,
      }}
    >
      <FlatList
        data={songs}
        keyExtractor={(s) => String(s.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshLibrary}
            tintColor="#7C4DFF"
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              playSongByBlob({
                blobName: item.audioUrl,
                title: item.title,
              })
            }
          >
            <View
              style={{
                backgroundColor: '#151827',
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text
                style={{ color: '#9aa3b2', marginTop: 4 }}
                numberOfLines={1}
              >
                {item.audioUrl}
              </Text>
              {'createdAt' in item && (
                <Text style={{ color: '#667085', marginTop: 6, fontSize: 12 }}>
                  {new Date((item as any).createdAt).toLocaleString()}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
