import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
