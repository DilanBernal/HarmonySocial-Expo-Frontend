import { ImageSourcePropType } from 'react-native';

type User = {
  id: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
  profileImage: string | ImageSourcePropType;
  favoriteInstrument: number | UserInstrument;
};

export default User;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  FROZEN = 'FROZEN',
}

export enum UserInstrument {
  GUITAR,
  PIANO,
  BASS,
}
