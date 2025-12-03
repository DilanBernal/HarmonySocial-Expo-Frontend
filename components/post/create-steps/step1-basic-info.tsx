import React from 'react';
import { TextInput, View, Text, StyleSheet, Pressable } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { PostFormValues, PostCategory } from '@/core/types/post';
import { Ionicons } from '@expo/vector-icons';

type Step1BasicInfoProps = {
  control: Control<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
};

const categoryOptions: { value: PostCategory; label: string; icon: string }[] = [
  { value: 'music', label: 'Música', icon: 'musical-notes' },
  { value: 'text', label: 'Texto', icon: 'document-text' },
  { value: 'image', label: 'Imagen', icon: 'image' },
  { value: 'video', label: 'Video', icon: 'videocam' },
];

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  control,
  errors,
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Información Básica</Text>
      
      {/* Categoría */}
      <Text style={styles.label}>Categoría del Post</Text>
      <Controller
        control={control}
        name="category"
        render={({ field, fieldState }) => (
          <View>
            <View style={styles.categoryContainer}>
              {categoryOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.categoryOption,
                    field.value === option.value && styles.categoryOptionSelected,
                    fieldState.error && styles.categoryOptionError,
                  ]}
                  onPress={() => field.onChange(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: field.value === option.value }}
                  accessibilityLabel={option.label}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={field.value === option.value ? '#7C4DFF' : '#9AA3B2'}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      field.value === option.value && styles.categoryLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {fieldState.error && (
              <Text style={styles.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Título */}
      <Text style={styles.label}>Título</Text>
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <View>
            <TextInput
              style={[styles.input, fieldState.error ? styles.inputError : null]}
              placeholder="Dale un título atractivo a tu post"
              placeholderTextColor="#8A90A6"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              maxLength={100}
              returnKeyType="next"
              accessibilityLabel="Título del post"
              accessibilityHint="Ingresa el título de tu post"
            />
            {fieldState.error && (
              <Text style={styles.error}>{fieldState.error.message}</Text>
            )}
            <Text style={styles.charCount}>{field.value?.length || 0}/100</Text>
          </View>
        )}
      />

      {/* Descripción corta */}
      <Text style={styles.label}>Descripción Corta</Text>
      <Controller
        control={control}
        name="short_description"
        render={({ field, fieldState }) => (
          <View>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                fieldState.error ? styles.inputError : null,
              ]}
              placeholder="Resume tu post en pocas palabras (máx. 150 caracteres)"
              placeholderTextColor="#8A90A6"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              maxLength={150}
              multiline
              numberOfLines={3}
              returnKeyType="next"
              accessibilityLabel="Descripción corta"
              accessibilityHint="Ingresa una descripción corta de tu post"
            />
            {fieldState.error && (
              <Text style={styles.error}>{fieldState.error.message}</Text>
            )}
            <Text style={styles.charCount}>
              {field.value?.length || 0}/150
            </Text>
          </View>
        )}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Consejos:</Text>
        <Text style={styles.infoText}>
          • Elige la categoría que mejor represente tu contenido{'\n'}
          • El título debe ser claro y atractivo{'\n'}
          • La descripción corta aparecerá en el feed
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
    minHeight: 80,
    textAlignVertical: 'top',
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  categoryOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#242A35',
    borderWidth: 2,
    borderColor: '#323A48',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderColor: '#7C4DFF',
  },
  categoryOptionError: {
    borderColor: '#EF4444',
  },
  categoryLabel: {
    color: '#9AA3B2',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: '#7C4DFF',
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
