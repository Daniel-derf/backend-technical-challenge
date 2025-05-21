import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import {
  IUserRepository,
  PaginatedResult,
  PaginationOptions,
} from './user.interface.repository';

// Data types
type DataUser = Omit<User, 'update' | 'switchStatus'>;
type DataProfile = Profile;

export class UserInMemoryRepository implements IUserRepository {
  private users: DataUser[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Silva',
      email: 'alice@email.com',
      isActive: true,
      profileId: '101',
    },
    {
      id: '2',
      firstName: 'Bruno',
      lastName: 'Souza',
      email: 'bruno@email.com',
      isActive: true,
      profileId: '102',
    },
    {
      id: '3',
      firstName: 'Carla',
      lastName: 'Oliveira',
      email: 'carla@email.com',
      isActive: false,
      profileId: '101',
    },
  ];

  private profiles: DataProfile[] = [
    {
      id: '101',
      name: 'Admin',
    },
    {
      id: '102',
      name: 'User',
    },
  ];

  async getAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.users.slice(start, end).map((user) => new User(user));

    return {
      data,
      total: this.users.length,
      page,
      limit,
    };
  }

  async getById(userId: string): Promise<User> {
    const dataUser = this.users.find((u) => u.id === userId);
    if (!dataUser) return null;

    return new User(dataUser);
  }

  async getProfileById(profileId: string): Promise<Profile> {
    const profile = this.profiles.find((p) => p.id === profileId);

    if (!profile) {
      return null;
    }

    return profile;
  }

  async getByProfile(
    profilesIds: string[],
    options?: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const filteredOutput = this.users
      .filter((u) => profilesIds.includes(u.profileId))
      .map((user) => new User(user));

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filteredOutput.slice(start, end);

    return {
      data,
      total: filteredOutput.length,
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
