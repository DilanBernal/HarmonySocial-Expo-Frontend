import FirstUploadPostStep from '@/components/post/upload-steps/first-step';
import useCreatePostViewModel from '@/core/viewmodels/post/create-post-view-model';
import { View } from 'react-native';
import { MultiStep, Step } from 'react-native-multistep';

const CreatePostScreen = () => {

  const { control } = useCreatePostViewModel();
  console.log(control)

  return (
    <View>
      <MultiStep
        progressCircleSize={0}
        progressCircleLabelStyle={{ display: 'none' }}
      >
        <Step title="">
          <FirstUploadPostStep control={control} />
        </Step>
        <Step title="">
          {/* <FirstUploadPostStep /> */}
          <View>
          </View>
        </Step>
        <Step title="">
          <View>
          </View>
        </Step>
      </MultiStep>
    </View>
  );
};
export default CreatePostScreen;
