import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { has } from 'lodash';
import { QueryBuilder, QueryFailedError } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

class UserModelException extends ExceptionsHandler {}

@Injectable()
export default class UserModel {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(data: object): Promise<UserEntity | null> {
    return await this.usersRepository.findOneOrFail(data);
  }

  async findOneBy(data: object): Promise<UserEntity> {
    return await this.usersRepository.findOneByOrFail(data);
  }

  queryBuilder(): QueryBuilder<UserEntity> {
    return this.usersRepository.createQueryBuilder("user");
  }

  async paginate(options: IPaginationOptions,data:any = {}): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(this.usersRepository, options, data);
  }

  async save(data: any): Promise<any>{
    try {
      return await this.usersRepository.save(data);
    } catch(err){
      throw new UserModelException(err);   
    }
  }

  async updateOne(find:any, data: any): Promise<any>{
    return await this.usersRepository.update(find,data);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
