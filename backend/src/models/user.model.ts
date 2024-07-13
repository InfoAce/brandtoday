import { Catch, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { has } from 'lodash';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryBuilder, QueryFailedError } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ModelException } from 'src/exceptions/model.exception';

class UserModelException extends ExceptionsHandler {}

@Injectable()
@Catch(QueryFailedError, EntityNotFoundError,CannotCreateEntityIdMapError)
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


  /**
   * Find a single user by the provided data.
   *
   * @param {object} data - The data used to find the user.
   * @returns {Promise<UserEntity>} A promise that resolves to the found user.
   * @throws {ModelException} Throws a ModelException if the user is not found.
   */
  async findOneBy(data: object): Promise<UserEntity> {
    try {

      return await this.usersRepository.findOneByOrFail(data);

    } catch(error){
        
      this.logger.error(error);
      
      throw new ModelException(error);
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
  
  /**
   * Create a new user in the database.
   *
   * @param {any} data - The user data to save.
   * @returns {Promise<UserEntity>} A promise that resolves to the saved user.
   * @throws {Error} Throws an error if there is an error saving the user.
   */
  async create(data: any) {
    try {
      // Save the user data to the database.
      return await this.usersRepository.create(data);

    } catch(error) {
      // Log any errors that occur during the save operation.
      this.logger.error(error);

      // Re-throw the error to be handled by the caller.
      throw error;
    }
  }

  /**
   * Save a user to the database.
   *
   * @param {any} data - The user data to save.
   * @returns {Promise<any>} A promise that resolves to the saved user.
   * @throws {Error} Throws an error if there is an error saving the user.
   */
  async save(data: any): Promise<any> {
    try {

      // Save the user data to the database.
      return await this.usersRepository.save(data);

    } catch(error) {

      // Log any errors that occur during the save operation.
      this.logger.error(error);

      // Re-throw the error to be handled by the caller.
      throw new CannotCreateEntityIdMapError(error.message,error);

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
