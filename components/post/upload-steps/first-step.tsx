import { useTheme } from '@react-navigation/native';
import { Control, Controller } from 'react-hook-form';
import { Text, TextInput, View, StyleSheet } from 'react-native';


type FirstUploadPostStepType = {
  control: Control<any>
}

const FirstUploadPostStep = ({ control }: FirstUploadPostStepType) => {
  const theme = useTheme();
  console.log(theme);
  if (!control) {
    return <Text>No se cartgo el control</Text>
  }

  return (
    <View>
      <Controller control={control} name='title'
        render={({ field, fieldState, formState }) =>
        /* eslint-disable indent*/
        (<View>
          <Text style={{ ...s.label, color: theme.colors.text }}>Titulo</Text>
          <TextInput style={s.input} />
        </View>)
        }
      />

    </View>
  );
};
export default FirstUploadPostStep;


export const s = StyleSheet.create({
  // Estilos compartidos para componentes hijos
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
  inputWithAffix: { paddingRight: 76 },
  inputError: { borderColor: '#EF4444' },
  error: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  affix: {
    position: 'absolute',
    right: 0,
    top: "50%",
    paddingHorizontal: 10,
    transform: [{ "translateY": "-50%" }, { "translateY": "5%" }],
    borderRadius: 100,
  },
  affixIcon: {
    color: '#9AA3B2',
  },
});
