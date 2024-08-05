import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildSubCategoryEntity } from '../entities';
import { ChildSubCategoryRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class ChildSubCategoryModel {
  /**
   * BrandModel constructor.
   * 
   * @param childSubCategoryRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ChildSubCategoryEntity.
     */
    @InjectRepository(ChildSubCategoryEntity)
    private childSubCategoryRepository: ChildSubCategoryRepository,
  ) {}
  
  /**
   * Finds multiple brand entities based on the provided data.
   *
   * @param {any} data - The data used to find the brands.
   * @return {Promise<ChildSubCategoryEntity[]>} A promise that resolves to an array of found brands.
   * @throws {ModelException} Throws a ModelException if there is an error finding the brands.
   */
  async find(data: any = {}): Promise<ChildSubCategoryEntity[]> {
    try {
      // Find multiple brand entities based on the provided data.
      // The find method of the childSubCategoryRepository is used to find the brands.
      return await this.childSubCategoryRepository.find(data);
    } catch (error) {
      // If there is an error finding the brands, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Finds a single brand entity based on the provided data.
   * Throws a ModelException if the brand is not found.
   *
   * @param {any} data - The data used to find the brand.
   * @return {Promise<ChildSubCategoryEntity>} A promise that resolves to the found brand.
   * @throws {ModelException} Throws a ModelException if the brand is not found.
   */
  async findOne(data: any): Promise<ChildSubCategoryEntity> {
    try {
      // Finds a single brand entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the childSubCategoryRepository is used to find the brand entity.
      return await this.childSubCategoryRepository.findOneOrFail(data);
    } catch (error) {
      // If the brand is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the brand entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<ChildSubCategoryEntity>>} A promise that resolves to the paginated brand entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ChildSubCategoryEntity>> {
    // Paginates the brand entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The childSubCategoryRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<ChildSubCategoryEntity>(this.childSubCategoryRepository, options);
  }

  /**
   * Updates a single brand entity based on the provided id and data.
   * Throws a ModelException if the brand is not found.
   *
   * @param {string} id - The id of the brand entity to update.
   * @param {any} data - The data used to update the brand entity.
   * @return {Promise<any>} A promise that resolves to the updated brand entity.
   * @throws {ModelException} Throws a ModelException if the brand entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single brand entity based on the provided id and data.
      // The childSubCategoryRepository's update method is used to update the brand entity.
      return await this.childSubCategoryRepository.update({id}, data);
    } catch (error) {
      // If the brand entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single brand entity based on the provided data.
   * Throws a ModelException if there is an error saving the brand.
   *
   * @param {any} data - The data used to save the brand.
   * @return {Promise<any>} A promise that resolves to the saved brand.
   * @throws {ModelException} Throws a ModelException if there is an error saving the brand.
   */
  async save(data: any): Promise<any> {
    try {
      // Saves a single brand entity based on the provided data.
      // The childSubCategoryRepository's save method is used to save the brand entity.
      return await this.childSubCategoryRepository.save(data);
    } catch (error) {
      // If there is an error saving the brand, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }


  /**
   * Deletes a single brand entity based on the provided id.
   *
   * @param {string} id - The id of the brand entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single brand entity based on the provided id.
    // The childSubCategoryRepository's delete method is used to delete the brand entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.childSubCategoryRepository.delete(id);
  }
}
