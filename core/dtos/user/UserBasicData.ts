import { UserInstrument } from '@/core/models/data/User';

type UserBasicData = {
  id: number;
  activeFrom: number;
  profileImageUrl?: string;
  profileImage?: string;
  username: string;
  learningPoints: number;
  favoriteInstrument: UserInstrument;
};

export default UserBasicData;
