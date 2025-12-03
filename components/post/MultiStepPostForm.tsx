import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MultiStep, Step } from 'react-native-multistep';
import { PostFormValues, PostPayload } from '@/core/types/post';
import {
  completePostValidationSchema,
} from '@/core/types/schemas/postValidationSchema';
import { Step1BasicInfo } from './create-steps/step1-basic-info';
import { Step2Content } from './create-steps/step2-content';
import { Step3Review } from './create-steps/step3-review';
import { postService } from '@/core/services/posts/PostService';
import { getCurrentUserId } from '@/core/utils/getCurrentUserId';

type MultiStepPostFormProps = {
  onSuccess?: () => void;
  initialValues?: Partial<PostFormValues>;
};

export const MultiStepPostForm: React.FC<MultiStepPostFormProps> = ({
  onSuccess,
  initialValues,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PostFormValues>({
    resolver: yupResolver(completePostValidationSchema),
    defaultValues: {
      category: initialValues?.category || 'music',
      title: initialValues?.title || '',
      short_description: initialValues?.short_description || '',
      description: initialValues?.description || '',
      song_id: initialValues?.song_id,
      ...initialValues,
    },
    mode: 'onChange',
  });

  /**
   * Handles form submission
   */
  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get form values
      const formValues = getValues();
      
      // Get current user ID
      const userId = getCurrentUserId();

      // Build the payload with auto-filled fields
      const payload: PostPayload = {
        title: formValues.title,
        short_description: formValues.short_description,
        description: formValues.description || '',
        publication_date: new Date().toISOString(),
        comments_number: 0,
        likes_number: 0,
        user_id: userId,
        category: formValues.category,
      };

      // Add song_id only if category is music
      if (formValues.category === 'music' && formValues.song_id) {
        payload.song_id = formValues.song_id;
      }

      // Add media_url if present (for future implementation)
      if (formValues.media_url) {
        payload.media_url = formValues.media_url;
      }

      console.log('[MultiStepPostForm] Submitting post:', payload);

      // Submit to API
      const subscription = postService.createPost(payload).subscribe({
        next: (createdPost) => {
          console.log('[MultiStepPostForm] Post created successfully:', createdPost);
          setIsSubmitting(false);
          
          Alert.alert(
            '¡Post Creado! 🎉',
            'Tu post ha sido publicado exitosamente.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (onSuccess) {
                    onSuccess();
                  }
                },
              },
            ]
          );
        },
        error: (error) => {
          console.error('[MultiStepPostForm] Error creating post:', error);
          setIsSubmitting(false);
          
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Ocurrió un error al crear el post. Por favor, intenta nuevamente.';
          
          setSubmitError(errorMessage);
          
          Alert.alert(
            'Error al Crear Post',
            errorMessage,
            [{ text: 'OK' }]
          );
        },
      });

      // Cleanup subscription when component unmounts
      return () => subscription.unsubscribe();
    } catch (error: any) {
      console.error('[MultiStepPostForm] Unexpected error:', error);
      setIsSubmitting(false);
      
      const errorMessage =
        error?.message ||
        'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
      
      setSubmitError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  if (isSubmitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
        <Text style={styles.loadingText}>Creando tu post...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {submitError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{submitError}</Text>
        </View>
      )}
      
      <MultiStep
        tintColor="rgba(124, 77, 255, 1)"
        nextButtonText="Siguiente"
        prevButtonText="Anterior"
        submitButtonText="Crear Post"
        buttonContainerStyle={styles.buttonContainer}
        nextButtonStyle={styles.button}
        prevButtonStyle={styles.buttonSecondary}
        submitButtonStyle={styles.buttonSubmit}
        progressCircleTrackColor="#1f1f71ff"
        progressCircleSize={57}
        progressCircleLabelStyle={styles.progressLabel}
        globalNextStepTitleStyle={{ display: 'none' }}
        onFinalStepSubmit={handleSubmit(onSubmit)}
      >
        {/* Step 1: Basic Info */}
        <Step
          title="Información Básica"
          stepContainerStyle={styles.stepContainer}
        >
          <Step1BasicInfo control={control} errors={errors} />
        </Step>

        {/* Step 2: Content */}
        <Step
          title="Contenido"
          stepContainerStyle={styles.stepContainer}
        >
          <Step2Content control={control} errors={errors} />
        </Step>

        {/* Step 3: Review */}
        <Step
          title="Revisar"
          stepContainerStyle={styles.stepContainer}
        >
          <Step3Review getValues={getValues} />
        </Step>
      </MultiStep>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  buttonContainer: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#7C4DFF',
    borderRadius: 12,
  },
  buttonSecondary: {
    backgroundColor: '#323A48',
    borderRadius: 12,
  },
  buttonSubmit: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
  },
  progressLabel: {
    color: '#F2F4FF',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#CDD3E1',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
  },
});
