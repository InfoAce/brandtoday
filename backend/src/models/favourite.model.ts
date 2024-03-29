import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouriteEntity } from '../entities';
import { FavouriteRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import { first } from 'lodash';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

class FavouriteModelException extends ExceptionsHandler {}

@Injectable()
export default class FavouriteModel {
  constructor(
    @InjectRepository(FavouriteEntity)
    private favouriteRepository: FavouriteRepository,
  ) {}
  
  async find(data:any): Promise<FavouriteEntity[]>{
    return await this.favouriteRepository.find(data);
  }

  async findOne(data:any): Promise<FavouriteEntity>{
    try{
      return await this.favouriteRepository.findOneOrFail(data);
    } catch(err) {
      throw new FavouriteModelException(err);   
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<FavouriteEntity>> {
    return paginate<FavouriteEntity>(this.favouriteRepository, options);
  }

  async updateOne(id: string, data: any): Promise<any>{
    return await this.favouriteRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    try {
      return await this.favouriteRepository.save(data);
    } catch(err){
      throw new FavouriteModelException(err);   
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.favouriteRepository.delete(id);
  }
}
