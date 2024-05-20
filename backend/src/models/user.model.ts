import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(UserEntity.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    try {

      return await this.usersRepository.find();

    } catch(error){
        
      this.logger.error(error);

    }
  }

  async findOne(data: object): Promise<UserEntity | null> {
    try {

      return await this.usersRepository.findOneOrFail(data);

    } catch(error){
      
      this.logger.error(error);

    }
  }

  async findOneBy(data: object): Promise<UserEntity> {
    try {

      return await this.usersRepository.findOneByOrFail(data);

    } catch(error){
        
      this.logger.error(error);
      
    }
  }

  queryBuilder(): QueryBuilder<UserEntity> {
    return this.usersRepository.createQueryBuilder("user");
  }

  async paginate(options: IPaginationOptions,data:any = {}): Promise<Pagination<UserEntity>> {
    try {

      return paginate<UserEntity>(this.usersRepository, options, data);

    } catch(error){
          
      this.logger.error(error);
      
    }
  }

  async save(data: any): Promise<any>{
    try {
    
      return await this.usersRepository.save(data);
    
    } catch(error){

      this.logger.error(error);  
    
    }
  }

  async updateOne(find:any, data: any): Promise<any>{
    try {

      return await this.usersRepository.update(find,data);
   
    } catch(error){

      this.logger.error(error);   
    
    }
  }

  async remove(id: number): Promise<void> {

    try{
    
      await this.usersRepository.delete(id);

    } catch(error){

      this.logger.error(error);  
    
    }
  }
}
