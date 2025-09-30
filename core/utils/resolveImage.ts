import { DEFAULT_AVATAR_KEY, DEFAULT_AVATARS } from '@/assets/defaultAvatars';
import { ImageSourcePropType } from 'react-native';

const AVATAR: ImageSourcePropType = DEFAULT_AVATARS[DEFAULT_AVATAR_KEY];

export default function resolveImage(
  img: string | ImageSourcePropType | undefined
): ImageSourcePropType {
  if (!img) return AVATAR;
  if (typeof img === 'string') {
    if (DEFAULT_AVATARS[img]) return DEFAULT_AVATARS[img];
    if (/^(https?:\/\/|file:\/\/|content:\/\/)/.test(img))
      return { uri: img } as ImageSourcePropType;
    // fallback: try as uri
    return { uri: img } as ImageSourcePropType;
  }
  return img;
}
