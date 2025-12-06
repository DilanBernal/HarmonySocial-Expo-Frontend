import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import { PostFormValues } from '@/core/types/post';
import { Ionicons } from '@expo/vector-icons';
import { songQueryService } from '@/core/services/songs/SongQueryService';
import { Song } from '@/core/models/data/Song';

type Step2ContentProps = {
  control: Control<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
};

export const Step2Content: React.FC<Step2ContentProps> = ({
  control,
  errors,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const category = useWatch({ control, name: 'category' });

  // Search songs when query changes
  useEffect(() => {
    if (category === 'music' && searchQuery.trim()) {
      setIsSearching(true);
      const subscription = songQueryService
        .search(searchQuery)
        .subscribe({
          next: (songs) => {
            setSearchResults(songs);
            setIsSearching(false);
          },
          error: (error) => {
            console.error('Error searching songs:', error);
            setIsSearching(false);
          },
        });

      return () => subscription.unsubscribe();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, category]);

  const renderCategoryContent = () => {
    switch (category) {
      case 'music':
        return (
          <>
            {/* Song Picker */}
            <Text style={styles.label}>Seleccionar Canción *</Text>
            <Controller
              control={control}
              name="song_id"
              render={({ field, fieldState }) => (
                <View>
                  {selectedSong ? (
                    <View style={styles.selectedSong}>
                      <View style={styles.selectedSongInfo}>
                        <Ionicons
                          name="musical-notes"
                          size={24}
                          color="#7C4DFF"
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.selectedSongTitle}>
                            {selectedSong.title}
                          </Text>
                          {selectedSong.artist && (
                            <Text style={styles.selectedSongArtist}>
                              {selectedSong.artist}
                            </Text>
                          )}
                        </View>
                        <Pressable
                          onPress={() => {
                            setSelectedSong(null);
                            field.onChange(undefined);
                            setSearchQuery('');
                          }}
                          style={styles.removeButton}
                        >
                          <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.searchContainer}>
                        <Ionicons
                          name="search"
                          size={20}
                          color="#9AA3B2"
                          style={styles.searchIcon}
                        />
                        <TextInput
                          style={[
                            styles.searchInput,
                            fieldState.error ? styles.inputError : null,
                          ]}
                          placeholder="Buscar canción..."
                          placeholderTextColor="#8A90A6"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          accessibilityLabel="Buscar canción"
                        />
                        {isSearching && (
                          <ActivityIndicator size="small" color="#7C4DFF" />
                        )}
                      </View>

                      {searchResults.length > 0 && (
                        <View style={styles.searchResults}>
                          <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                              <Pressable
                                style={styles.songItem}
                                onPress={() => {
                                  setSelectedSong(item);
                                  field.onChange(item.id);
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                              >
                                <Ionicons
                                  name="musical-note"
                                  size={20}
                                  color="#9AA3B2"
                                />
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.songItemTitle}>
                                    {item.title}
                                  </Text>
                                  {item.artist && (
                                    <Text style={styles.songItemArtist}>
                                      {item.artist}
                                    </Text>
                                  )}
                                </View>
                              </Pressable>
                            )}
                            style={styles.songList}
                            nestedScrollEnabled
                          />
                        </View>
                      )}
                    </>
                  )}
                  {fieldState.error && (
                    <Text style={styles.error}>{fieldState.error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Description for music */}
            <Text style={styles.label}>Descripción *</Text>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      fieldState.error ? styles.inputError : null,
                    ]}
                    placeholder="Cuéntanos sobre esta canción y por qué la compartes..."
                    placeholderTextColor="#8A90A6"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={5000}
                    multiline
                    numberOfLines={6}
                    accessibilityLabel="Descripción del post"
                  />
                  {fieldState.error && (
                    <Text style={styles.error}>{fieldState.error.message}</Text>
                  )}
                  <Text style={styles.charCount}>
                    {field.value?.length || 0}/5000
                  </Text>
                </View>
              )}
            />
          </>
        );

      case 'text':
        return (
          <>
            <Text style={styles.label}>Contenido *</Text>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      styles.textAreaLarge,
                      fieldState.error ? styles.inputError : null,
                    ]}
                    placeholder="Comparte tus pensamientos, ideas o historias..."
                    placeholderTextColor="#8A90A6"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={5000}
                    multiline
                    numberOfLines={10}
                    accessibilityLabel="Contenido del post"
                  />
                  {fieldState.error && (
                    <Text style={styles.error}>{fieldState.error.message}</Text>
                  )}
                  <Text style={styles.charCount}>
                    {field.value?.length || 0}/5000
                  </Text>
                </View>
              )}
            />
          </>
        );

      case 'image':
      case 'video':
        return (
          <>
            {/* Media picker placeholder */}
            <Text style={styles.label}>
              {category === 'image' ? 'Imagen' : 'Video'}
            </Text>
            <View style={styles.mediaPlaceholder}>
              <Ionicons
                name={category === 'image' ? 'image-outline' : 'videocam-outline'}
                size={48}
                color="#9AA3B2"
              />
              <Text style={styles.mediaPlaceholderText}>
                Selector de {category === 'image' ? 'imagen' : 'video'}
              </Text>
              <Text style={styles.mediaPlaceholderSubtext}>
                (Pendiente de implementar)
              </Text>
            </View>

            {/* Optional description */}
            <Text style={styles.label}>Descripción (opcional)</Text>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      fieldState.error ? styles.inputError : null,
                    ]}
                    placeholder="Agrega una descripción a tu contenido..."
                    placeholderTextColor="#8A90A6"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={5000}
                    multiline
                    numberOfLines={4}
                    accessibilityLabel="Descripción opcional"
                  />
                  {fieldState.error && (
                    <Text style={styles.error}>{fieldState.error.message}</Text>
                  )}
                  <Text style={styles.charCount}>
                    {field.value?.length || 0}/5000
                  </Text>
                </View>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Contenido del Post</Text>
      {renderCategoryContent()}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>{'\u{1F4A1}'} Según tu categoría:</Text>
        <Text style={styles.infoText}>
          {category === 'music' &&
            '• Selecciona la canción que quieres compartir\n• Explica por qué te gusta o qué significa para ti'}
          {category === 'text' &&
            '• Comparte tus ideas, reflexiones o historias\n• Sé auténtico y expresa tu voz'}
          {(category === 'image' || category === 'video') &&
            '• Agrega tu contenido multimedia\n• La descripción es opcional pero recomendada'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#E6EAF2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    color: '#CDD3E1',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    color: '#E6EAF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    minHeight: 200,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  charCount: {
    color: '#9AA3B2',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    color: '#E6EAF2',
    fontSize: 16,
    padding: 0,
  },
  searchResults: {
    marginTop: 8,
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    borderRadius: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  songList: {
    maxHeight: 200,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#323A48',
  },
  songItemTitle: {
    color: '#E6EAF2',
    fontSize: 14,
    fontWeight: '600',
  },
  songItemArtist: {
    color: '#9AA3B2',
    fontSize: 12,
    marginTop: 2,
  },
  selectedSong: {
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedSongInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedSongTitle: {
    color: '#E6EAF2',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedSongArtist: {
    color: '#9AA3B2',
    fontSize: 13,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  mediaPlaceholder: {
    backgroundColor: '#242A35',
    borderWidth: 2,
    borderColor: '#323A48',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mediaPlaceholderText: {
    color: '#9AA3B2',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaPlaceholderSubtext: {
    color: '#8A90A6',
    fontSize: 12,
    fontStyle: 'italic',
  },
  infoBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
  },
  infoTitle: {
    color: '#CDD3E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoText: {
    color: '#A8B0C3',
    fontSize: 12,
    lineHeight: 16,
  },
});
