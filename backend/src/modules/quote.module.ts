import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteEntity } from 'src/entities';
import { QuoteModel } from 'src/models';

@Module({
  exports:  [
    QuoteModel
  ],
  imports: [
    TypeOrmModule.forFeature([
        QuoteEntity
    ])
  ],
  providers: [
    QuoteModel
  ]
})

export class QuoteModule {}
