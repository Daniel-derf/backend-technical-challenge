import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserInMemoryRepository } from './repository/user.in-memory.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'IUserRepository', useClass: UserInMemoryRepository },
  ],
})
export class UserModule {}
