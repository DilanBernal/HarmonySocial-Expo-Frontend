import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UseFormGetValues } from 'react-hook-form';
import { PostFormValues } from '@/core/types/post';
import { Ionicons } from '@expo/vector-icons';

type Step3ReviewProps = {
  getValues: UseFormGetValues<PostFormValues>;
};

export const Step3Review: React.FC<Step3ReviewProps> = ({ getValues }) => {
  const formValues = getValues();

  const getCategoryLabel = (category: string) => {
    const labels = {
      music: 'Música',
      text: 'Texto',
      image: 'Imagen',
      video: 'Video',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      music: 'musical-notes',
      text: 'document-text',
      image: 'image',
      video: 'videocam',
    };
    return icons[category as keyof typeof icons] || 'document';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Revisar tu Post</Text>
      <Text style={styles.subtitle}>
        Verifica que toda la información sea correcta antes de publicar
      </Text>

      {/* Category */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Categoría</Text>
        <View style={styles.categoryBadge}>
          <Ionicons
            name={getCategoryIcon(formValues.category) as any}
            size={20}
            color="#7C4DFF"
          />
          <Text style={styles.categoryBadgeText}>
            {getCategoryLabel(formValues.category)}
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Título</Text>
        <Text style={styles.reviewValue}>{formValues.title}</Text>
      </View>

      {/* Short Description */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Descripción Corta</Text>
        <Text style={styles.reviewValue}>{formValues.short_description}</Text>
      </View>

      {/* Song ID (only for music) */}
      {formValues.category === 'music' && formValues.song_id && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Canción Seleccionada</Text>
          <View style={styles.songBadge}>
            <Ionicons name="musical-note" size={18} color="#7C4DFF" />
            <Text style={styles.reviewValue}>ID: {formValues.song_id}</Text>
          </View>
        </View>
      )}

      {/* Description */}
      {formValues.description && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>
            {formValues.category === 'music' || formValues.category === 'text'
              ? 'Descripción'
              : 'Descripción (Opcional)'}
          </Text>
          <Text style={styles.reviewValueMultiline}>
            {formValues.description}
          </Text>
        </View>
      )}

      {/* Info box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#7C4DFF" />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Información adicional</Text>
          <Text style={styles.infoText}>
            Al publicar, tu post será visible para todos los usuarios de Harmony
            Social. Los siguientes campos se completarán automáticamente:
          </Text>
          <View style={styles.autoFields}>
            <Text style={styles.autoFieldItem}>• Fecha de publicación: Ahora</Text>
            <Text style={styles.autoFieldItem}>• Comentarios: 0</Text>
            <Text style={styles.autoFieldItem}>• Likes: 0</Text>
            <Text style={styles.autoFieldItem}>• Usuario: Tu perfil</Text>
          </View>
        </View>
      </View>

      {/* Final action hint */}
      <View style={styles.finalHint}>
        <Text style={styles.finalHintText}>
          Presiona "Crear Post" para publicar tu contenido
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    color: '#E6EAF2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9AA3B2',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  reviewSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#242A35',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#323A48',
  },
  reviewLabel: {
    color: '#9AA3B2',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewValue: {
    color: '#E6EAF2',
    fontSize: 15,
    fontWeight: '500',
  },
  reviewValueMultiline: {
    color: '#E6EAF2',
    fontSize: 14,
    lineHeight: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    color: '#7C4DFF',
    fontSize: 14,
    fontWeight: '600',
  },
  songBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoBox: {
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
    flexDirection: 'row',
    gap: 12,
  },
  infoTitle: {
    color: '#CDD3E1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#A8B0C3',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  autoFields: {
    marginTop: 4,
  },
  autoFieldItem: {
    color: '#9AA3B2',
    fontSize: 11,
    lineHeight: 18,
  },
  finalHint: {
    padding: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    marginBottom: 20,
  },
  finalHintText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
