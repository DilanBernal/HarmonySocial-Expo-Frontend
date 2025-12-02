import React from 'react';
import { Pressable, ImageBackground, View, Text, StyleSheet } from 'react-native';
import { instrumentOptionType } from '@/core/types/instrumentOption';
import { UserInstrument } from '@/core/models/data/User';

const InstrumentOption = ({
  item,
  isSelected,
  handleInstrumentSelect,
}: {
  item: instrumentOptionType;
  isSelected: boolean;
  handleInstrumentSelect: (ins: UserInstrument) => void;
}) => {
  return (
    <Pressable
      style={[
        styles.instrumentCard,
        isSelected && styles.instrumentCardSelected,
      ]}
      onPress={() => handleInstrumentSelect(item.key)}
      accessibilityRole="button"
      accessibilityLabel={`Seleccionar ${item.label}`}
      accessibilityHint={item.description}
      accessibilityState={{
        selected: isSelected,
      }}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.instrumentImage}
        imageStyle={styles.instrumentImageStyle}
      >
        <View style={styles.instrumentOverlay}>
          <View
            style={[
              styles.instrumentLabelContainer,
              isSelected && styles.instrumentLabelSelected,
            ]}
          >
            <Text style={styles.instrumentLabel}>{item.label}</Text>
            <Text style={styles.instrumentDescription}>{item.description}</Text>
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedCheckmark}>✓</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default InstrumentOption;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#E6EAF2',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: '#A8B0C3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  listContainer: {
    gap: 16,
    paddingVertical: 8,
  },

  instrumentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },

  instrumentCardSelected: {
    borderColor: '#7C4DFF',
    shadowColor: '#7C4DFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  instrumentImage: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },

  instrumentImageStyle: {
    borderRadius: 14,
  },

  instrumentOverlay: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
  },

  instrumentLabelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  instrumentLabelSelected: {
    backgroundColor: 'rgba(124, 77, 255, 0.8)',
  },

  instrumentLabel: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },

  instrumentDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontStyle: 'italic',
  },

  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  selectedCheckmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },

  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
  },

  infoTitle: {
    color: '#CDD3E1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  infoText: {
    color: '#A8B0C3',
    fontSize: 13,
    lineHeight: 18,
  },
}); 