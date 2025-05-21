import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IUserRepository {
  getAll(options: PaginationOptions): Promise<PaginatedResult<User>>;
  getById(userId: string): Promise<User>;
  getAllProfiles(): Promise<Profile[]>;
  getByProfile(
    profilesIds: string[],
    options?: PaginationOptions,
  ): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
