import { Module } from '@nestjs/common';
import { QueueModel } from '../models';
import { QueueEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[QueueModel],
  imports: [
    TypeOrmModule.forFeature([QueueEntity])
  ],
  providers: [QueueModel],
})
export class QueueModule {}
