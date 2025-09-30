import { UserInstrument } from '@/core/models/data/User';

type UserBasicData = {
  id: number;
  fullName: string;
  email: string;
  activeFrom: number;
  profileImage: string;
  username: string;
  learningPoints: number;
  favoriteInstrument: UserInstrument;
};

export default UserBasicData;
