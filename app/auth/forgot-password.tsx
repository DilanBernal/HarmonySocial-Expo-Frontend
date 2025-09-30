import useForgotPasswordViewModel from '@/core/viewmodels/auth/forgot-password-view-model';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Controller } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ResetPasswordScreen() {
  const { control } = useForgotPasswordViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0c16' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={s.card}>
            <Text style={s.title}>Restablecer contraseña</Text>
            <Text style={s.subtitle}>
              Ingresa tu email y te enviaremos un enlace para restablecerla.
            </Text>

            <KeyboardAvoidingView>
              <Text style={s.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      style={[s.input, fieldState.error ? s.inputError : null]}
                      placeholder="tu@correo.com"
                      placeholderTextColor="#8A90A6"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      returnKeyType="done"
                    />
                    {fieldState.error && (
                      <Text style={s.error}>{fieldState.error.message}</Text>
                    )}
                  </View>
                )}
              />

              <LinearGradient
                colors={['#7C4DFF', '#4C63F2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.btnGrad}
              >
                {/* <Pressable
                      onPress={() => handleSubmit()}
                      disabled={!isValid || isSubmitting}
                      style={({ pressed }) => [
                        s.btn,
                        (!isValid || isSubmitting) && s.btnDisabled,
                        pressed && s.btnPressed,
                      ]}
                    >
                      <Text style={s.btnText}>Enviar enlace</Text>
                    </Pressable> */}
              </LinearGradient>

              <Pressable
                onPress={() => Linking.openURL('mailto:')}
                style={{ marginTop: 14 }}
              >
                <Text style={s.link}>Abrir app de correo</Text>
              </Pressable>

              {/* <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 6 }}
                  >
                    <Text style={s.linkMuted}>Volver a iniciar sesión</Text>
                  </Pressable> */}
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#1b1f27e6',
    borderColor: '#ffffff22',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
  },
  title: {
    color: '#E6EAF2',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A8B0C3',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },

  label: { color: '#CDD3E1', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    color: '#E6EAF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: { borderColor: '#EF4444' },
  error: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  btnGrad: { borderRadius: 14, marginTop: 18 },
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.9 },
  btnText: { color: '#F2F4FF', fontWeight: '800' },

  link: {
    color: '#C9D0E3',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  linkMuted: {
    color: '#A8B0C3',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
