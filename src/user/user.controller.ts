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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List users with pagination' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated users list' })
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
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate/deactivate user' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ schema: { properties: { isActive: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'User status updated' })
  switchStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    if (typeof isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }
    return this.userService.switchUserStatus(id, isActive);
  }

  @Get('/filter/by-profiles')
  @ApiOperation({ summary: 'Filter users by profile ids' })
  @ApiQuery({
    name: 'profiles',
    required: true,
    description: 'Comma separated profile ids',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Filtered users list' })
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
  @ApiOperation({ summary: 'List all profiles (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Profiles list' })
  findAllProfiles() {
    return this.userService.findAllProfiles();
  }
}
