import { Module } from '@nestjs/common';
import { FavouriteModel } from '../models';
import { FavouriteController } from 'src/controllers';
import { FavouriteEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[FavouriteModel],
  imports: [
    TypeOrmModule.forFeature([FavouriteEntity])
  ],
  providers: [FavouriteModel],
})
export class FavouriteModule {}
