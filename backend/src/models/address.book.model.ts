import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressBookEntity, FavouriteEntity } from '../entities';
import { DeleteResult } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AddressBookRepository } from 'src/repositories';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

class AddressBookModelException extends ExceptionsHandler {}

@Injectable()
export default class AddressBookModel {
  constructor(
    @InjectRepository(AddressBookEntity)
    private addressBookRepository: AddressBookRepository,
  ) {}
  
  async find(data:any): Promise<AddressBookEntity[]>{
    return await this.addressBookRepository.find(data);
  }

  async findOne(data:any): Promise<AddressBookEntity>{
    try{
      return await this.addressBookRepository.findOneOrFail(data);
    } catch(err) {
      throw new AddressBookModelException(err);   
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<AddressBookEntity>> {
    return paginate<AddressBookEntity>(this.addressBookRepository, options);
  }


  async updateOne(id: string, data: any): Promise<any>{
    return await this.addressBookRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    try {
      return await this.addressBookRepository.save(data);
    } catch(err){
      throw new AddressBookModelException(err);   
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.addressBookRepository.delete(id);
  }
}
