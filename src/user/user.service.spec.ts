import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserInMemoryRepository } from './repository/user.in-memory.repository';
import {
  IUserRepository,
  PaginationOptions,
} from './repository/user.interface.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService (InMemory)', () => {
  let service: UserService;
  let repository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'IUserRepository', useClass: UserInMemoryRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated users', async () => {
    const options: PaginationOptions = { page: 1, limit: 2 };
    const result = await service.findAll(options);
    expect(result.data.length).toBe(2);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
  });

  it('should return a user by id', async () => {
    const users = await service.findAll({ page: 1, limit: 1 });
    const user = await service.findOne(users.data[0].id);
    expect(user).toHaveProperty('id', users.data[0].id);
  });

  it('should throw NotFoundException if user not found', async () => {
    await expect(service.findOne('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a user', async () => {
    const input: CreateUserDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
      profileId: '101',
    };

    const id = await service.create(input);
    const user = await service.findOne(id);

    expect(id).toBeDefined();
    expect(user.firstName).toBe('Test');
    expect(user.email).toBe('test@email.com');
  });

  it('should update a user', async () => {
    const users = await service.findAll({ page: 1, limit: 1 });
    const userId = users.data[0].id;
    const updateDto: UpdateUserDto = { firstName: 'UpdatedName' };
    const updated = await service.update(userId, updateDto);
    expect(updated.firstName).toBe('UpdatedName');
    const user = await service.findOne(userId);
    expect(user.firstName).toBe('UpdatedName');
  });

  it('should throw NotFoundException on update if user not found', async () => {
    await expect(
      service.update('non-existent-id', { firstName: 'X' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a user', async () => {
    const users = await service.findAll({ page: 1, limit: 1 });
    const userId = users.data[0].id;
    await service.remove(userId);
    await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException on remove if user not found', async () => {
    await expect(service.remove('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should paginate getByProfile', async () => {
    // Adiciona mais usuários para garantir a paginação
    await service.create({
      firstName: 'Extra',
      lastName: 'Profile',
      email: 'extra@email.com',
      profileId: '101',
    });
    const result = await repository.getByProfile(['101'], {
      page: 1,
      limit: 2,
    });
    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.data.every((u) => u.profileId === '101')).toBe(true);
  });
});
