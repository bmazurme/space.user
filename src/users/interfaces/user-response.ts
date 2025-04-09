import { User } from '../entities/user.entity';

export interface UserResponse {
  user: User | null;
  message: string;
  error: string | null;
  statusCode: number;
}
