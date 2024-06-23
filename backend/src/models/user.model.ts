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

  /**
   * Find all users based on the provided data.
   *
   * @param {object} data - The data used to filter the users.
   * @return {Promise<UserEntity[]>} - A promise that resolves to an array of UserEntity objects.
   */
  async findAll(data: any): Promise<UserEntity[]> {
    try {

      // Find all users in the repository based on the provided data.
      return await this.usersRepository.find(data);

    } catch(error){
       
      // Log any errors that occur during the execution of the function.
      this.logger.error(error);

    }
  }

  /**
   * Find all users and count based on the provided data.
   *
   * @param {object} data - The data used to filter the users.
   * @return {Promise<any>} - A promise that resolves to an object containing an array of UserEntity objects and the count of total users.
   */
  async findAndCount(data: any): Promise<any> {
    try {

      // Find all users in the repository based on the provided data.
      return await this.usersRepository.findAndCount(data);

    } catch(error){
      
      // Log any errors that occur during the execution of the function.
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
