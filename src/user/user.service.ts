import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IUserRepository,
  PaginationOptions,
} from './repository/user.interface.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);

    await this.usersRepository.save(user);

    return user.id;
  }

  async findAll(options: PaginationOptions) {
    return this.usersRepository.getAll(options);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');

    user.update(updateUserDto);

    await this.usersRepository.save(user);

    return user;
  }

  async remove(id: string) {
    const user = await this.usersRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);

    return;
  }

  async switchUserStatus(userId: string, status: boolean) {
    const user = await this.usersRepository.getById(userId);

    if (!user) throw new NotFoundException('User does not exist');

    try {
      user.switchStatus(status);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.usersRepository.save(user);
  }

  async findAllProfiles() {
    return this.usersRepository.getAllProfiles();
  }

  async findAllByProfiles(profilesIds: string[], options?: PaginationOptions) {
    return this.usersRepository.getByProfile(profilesIds, options);
  }
}
