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

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários com paginação' })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Página',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limite por página',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuários' })
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
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', required: true, description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  @ApiParam({ name: 'id', required: true, description: 'ID do usuário' })
  @ApiBody({
    schema: {
      properties: {
        isActive: { type: 'boolean', description: 'Novo status do usuário' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Status do usuário atualizado' })
  switchStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    if (typeof isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }
    return this.userService.switchUserStatus(id, isActive);
  }

  @Get('/filter/by-profiles')
  @ApiOperation({ summary: 'Filtrar usuários por perfis' })
  @ApiQuery({
    name: 'profiles',
    required: true,
    description: 'IDs dos perfis separados por vírgula',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários filtrada por perfis',
  })
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
  @ApiOperation({ summary: 'Listar todos os perfis (paginado)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite por página',
  })
  @ApiResponse({ status: 200, description: 'Lista de perfis' })
  findAllProfiles() {
    return this.userService.findAllProfiles();
  }
}
