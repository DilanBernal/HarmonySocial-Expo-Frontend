import { UserInstrument } from '../models/data/User';

/**
 * DTO para el registro de usuario que coincide exactamente
 * con la estructura esperada por el backend
 */
export interface RegisterDTO {
  fullName: string;
  email: string;
  username: string;
  password: string;
  profileImage: string;
  favoriteInstrument: UserInstrument;
}
