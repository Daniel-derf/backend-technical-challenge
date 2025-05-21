import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      switchUserStatus: jest.fn(),
      findAllByProfiles: jest.fn(),
      findAllProfiles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: serviceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create', async () => {
    const dto: CreateUserDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
      profileId: 'uuid-profile',
    };
    (service.create as jest.Mock).mockResolvedValue('new-id');
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe('new-id');
  });

  it('should call service.findAll on findAll', async () => {
    (service.findAll as jest.Mock).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });
    const result = await controller.findAll('1', '10');
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
  });

  it('should throw if page or limit is missing on findAll', () => {
    expect(() => controller.findAll(undefined, '10')).toThrow();
    expect(() => controller.findAll('1', undefined)).toThrow();
  });

  it('should call service.findOne on findOne', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should call service.update on update', async () => {
    const dto: UpdateUserDto = {
      firstName: 'Updated',
    };
    (service.update as jest.Mock).mockResolvedValue({ id: '1', ...dto });
    const result = await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ id: '1', ...dto });
  });

  it('should call service.remove on remove', async () => {
    (service.remove as jest.Mock).mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(result).toBeUndefined();
  });

  it('should call service.switchUserStatus on switchStatus', async () => {
    (service.switchUserStatus as jest.Mock).mockResolvedValue({
      id: '1',
      isActive: true,
    });
    const result = await controller.switchStatus('1', true);
    expect(service.switchUserStatus).toHaveBeenCalledWith('1', true);
    expect(result).toEqual({ id: '1', isActive: true });
  });

  it('should throw if isActive is not boolean on switchStatus', () => {
    expect(() => controller.switchStatus('1', undefined as any)).toThrow();
    expect(() => controller.switchStatus('1', 'true' as any)).toThrow();
  });

  it('should call service.findAllByProfiles on findAllByProfiles', async () => {
    (service.findAllByProfiles as jest.Mock).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });
    const result = await controller.findAllByProfiles('101,102', '1', '10');
    expect(service.findAllByProfiles).toHaveBeenCalledWith(['101', '102'], {
      page: 1,
      limit: 10,
    });
    expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
  });

  it('should throw if profiles is missing on findAllByProfiles', () => {
    expect(() =>
      controller.findAllByProfiles(undefined as any, '1', '10'),
    ).toThrow();
  });

  it('should call service.findAllProfiles on findAllProfiles', async () => {
    (service.findAllProfiles as jest.Mock).mockResolvedValue([
      { id: '101', name: 'Admin' },
    ]);
    const result = await controller.findAllProfiles();
    expect(service.findAllProfiles).toHaveBeenCalled();
    expect(result).toEqual([{ id: '101', name: 'Admin' }]);
  });
});
