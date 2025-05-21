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
  getAll(): Promise<PaginatedResult<User>>;
  getById(userId: string): Promise<User>;
  getByProfile(profilesIds: string[]): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
