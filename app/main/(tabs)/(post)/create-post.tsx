import FirstUploadPostStep from '@/components/post/upload-steps/first-step';
import { View } from 'react-native';
import { MultiStep, Step } from 'react-native-multistep';

const CreatePostScreen = () => {
  return (
    <View>
      <MultiStep
        progressCircleSize={0}
        progressCircleLabelStyle={{ display: 'none' }}
        headerStyle={{ backgroundColor: 'blue' }}
      >
        <Step title="">
          <View>
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
          </View>
        </Step>
        <Step title="">
          <View>
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
          </View>
        </Step>
        <Step title="">
          <View>
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
            <FirstUploadPostStep />
          </View>
        </Step>
      </MultiStep>
    </View>
  );
};
export default CreatePostScreen;
