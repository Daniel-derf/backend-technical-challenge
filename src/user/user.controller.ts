import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (!page || !limit) {
      throw new BadRequestException('page and limit are required');
    }
    return this.userService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch(':id/status')
  switchStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    if (typeof isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }
    return this.userService.switchUserStatus(id, isActive);
  }

  @Get('/filter/by-profiles')
  findAllByProfiles(
    @Query('profiles') profiles: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!profiles) {
      throw new BadRequestException('profiles is required');
    }
    const profilesIds = profiles.split(',');
    return this.userService.findAllByProfiles(profilesIds, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }

  @Get('/profiles')
  findAllProfiles() {
    return this.userService.findAllProfiles();
  }
}
