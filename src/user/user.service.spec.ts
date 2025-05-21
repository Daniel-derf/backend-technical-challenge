import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserInMemoryRepository } from './repository/user.in-memory.repository';
import { PaginationOptions } from './repository/user.interface.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService (InMemory)', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'IUserRepository', useClass: UserInMemoryRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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

  it('should paginate getByProfile via service', async () => {
    await service.create({
      firstName: 'Extra',
      lastName: 'Profile',
      email: 'extra@email.com',
      profileId: '101',
    });
    const result = await service.findAllByProfiles(['101'], {
      page: 1,
      limit: 2,
    });
    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.data.every((u) => u.profileId === '101')).toBe(true);
  });

  it('should paginate correctly with many users', async () => {
    const totalUsers = 50;
    for (let i = 0; i < totalUsers; i++) {
      await service.create({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        email: `user${i}@email.com`,
        profileId: i % 2 === 0 ? '101' : '102',
      });
    }

    const pageSize = 10;
    for (let page = 1; page <= 5; page++) {
      const result = await service.findAll({ page, limit: pageSize });
      expect(result.data.length).toBeLessThanOrEqual(pageSize);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(pageSize);
    }

    const profileId = '101';
    const byProfile = await service.findAllByProfiles([profileId], {
      page: 2,
      limit: 5,
    });
    expect(byProfile.data.length).toBeLessThanOrEqual(5);
    expect(byProfile.page).toBe(2);
    expect(byProfile.limit).toBe(5);
    expect(byProfile.data.every((u) => u.profileId === profileId)).toBe(true);

    const allUsers = await service.findAll({ page: 1, limit: 1000 });
    const total = allUsers.total;
    const lastPage = Math.ceil(total / pageSize);
    const lastPageResult = await service.findAll({
      page: lastPage,
      limit: pageSize,
    });
    if (total % pageSize === 0) {
      expect(lastPageResult.data.length).toBe(pageSize);
    } else {
      expect(lastPageResult.data.length).toBe(total % pageSize);
    }
  });

  it('should switch user status', async () => {
    const users = await service.findAll({ page: 1, limit: 1 });
    const userId = users.data[0].id;
    const userBefore = await service.findOne(userId);
    const newStatus = !userBefore.isActive;
    await service.switchUserStatus(userId, newStatus);
    const userAfter = await service.findOne(userId);
    expect(userAfter.isActive).toBe(newStatus);
  });

  it('should throw BadRequestException if status is already set', async () => {
    const users = await service.findAll({ page: 1, limit: 1 });
    const userId = users.data[0].id;
    const user = await service.findOne(userId);
    await expect(
      service.switchUserStatus(userId, user.isActive),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    await expect(
      service.switchUserStatus('non-existent-id', true),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return profiles', async () => {
    await service.create({
      firstName: 'ProfileTest1',
      lastName: 'User1',
      email: 'profile1@email.com',
      profileId: '101',
    });
    await service.create({
      firstName: 'ProfileTest2',
      lastName: 'User2',
      email: 'profile2@email.com',
      profileId: '102',
    });

    const result = await service.findAllProfiles();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });
});
