import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import {
  IUserRepository,
  PaginatedResult,
  PaginationOptions,
} from './user.interface.repository';

export class UserInMemoryRepository implements IUserRepository {
  private users: User[] = [];
  private profiles: Profile[] = [];

  async getAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.users.slice(start, end);

    return {
      data,
      total: this.users.length,
      page,
      limit,
    };
  }

  async getById(userId: string): Promise<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async getByProfile(
    profilesIds: string[],
    options?: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const filtered = this.users.filter((u) =>
      profilesIds.includes(u.profileId),
    );
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return {
      data,
      total: filtered.length,
      page,
      limit,
    };
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profiles;
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      this.users.push(user);
    } else {
      this.users[index] = user;
    }
  }

  async delete(userId: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    this.users.splice(index, 1);
  }
}
