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

@Injectable()
export default class FavouriteModel {
  constructor(
    @InjectRepository(FavouriteEntity)
    private favouriteRepository: FavouriteRepository,
  ) {}
  
  async find(data:any): Promise<FavouriteEntity>{
    return await this.favouriteRepository.findOneOrFail(data);
  }

  async first(): Promise<FavouriteEntity>{
    return first(await this.favouriteRepository.find());
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<FavouriteEntity>> {
    return paginate<FavouriteEntity>(this.favouriteRepository, options);
  }

  async updateOne(id: string, data: any): Promise<any>{
    return await this.favouriteRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    return await this.favouriteRepository.save(data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.favouriteRepository.delete(id);
  }
}
