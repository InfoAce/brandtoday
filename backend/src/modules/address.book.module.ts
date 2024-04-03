import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookController } from 'src/controllers';
import { AddressBookEntity } from 'src/entities';
import { AddressBookModel } from 'src/models';

@Module({
  exports:     [AddressBookModel],
  imports: [
    TypeOrmModule.forFeature([AddressBookEntity])
  ],
  providers:   [AddressBookModel]
})

export class AddressBookModule {}
