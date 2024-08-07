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
   * @param childSubCategoryRepository - The child-sub-product-category repository.
   */
  constructor(
    /**
     * The child-sub-product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ChildSubCategoryEntity.
     */
    @InjectRepository(ChildSubCategoryEntity)
    private childSubCategoryRepository: ChildSubCategoryRepository,
  ) {}
  
  /**
   * Finds multiple child-sub-product-category entities based on the provided data.
   *
   * @param {any} data - The data used to find the child-sub-product-categories.
   * @return {Promise<ChildSubCategoryEntity[]>} A promise that resolves to an array of found child-sub-product-categories.
   * @throws {ModelException} Throws a ModelException if there is an error finding the child-sub-product-categories.
   */
  async find(data: any = {}): Promise<ChildSubCategoryEntity[]> {
    try {
      // Find multiple child-sub-product-category entities based on the provided data.
      // The find method of the childSubCategoryRepository is used to find the child-sub-product-categories.
      return await this.childSubCategoryRepository.find(data);
    } catch (error) {
      // If there is an error finding the child-sub-product-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Finds a single child-sub-product-category entity based on the provided data.
   * Throws a ModelException if the child-sub-product-category is not found.
   *
   * @param {any} data - The data used to find the child-sub-product-category.
   * @return {Promise<ChildSubCategoryEntity>} A promise that resolves to the found child-sub-product-category.
   * @throws {ModelException} Throws a ModelException if the child-sub-product-category is not found.
   */
  async findOne(data: any): Promise<ChildSubCategoryEntity> {
    try {
      // Finds a single child-sub-product-category entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the childSubCategoryRepository is used to find the child-sub-product-category entity.
      return await this.childSubCategoryRepository.findOneOrFail(data);
    } catch (error) {
      // If the child-sub-product-category is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the child-sub-product-category entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<ChildSubCategoryEntity>>} A promise that resolves to the paginated child-sub-product-category entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ChildSubCategoryEntity>> {
    // Paginates the child-sub-product-category entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The childSubCategoryRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<ChildSubCategoryEntity>(this.childSubCategoryRepository, options);
  }

  /**
   * Updates a single child-sub-product-category entity based on the provided id and data.
   * Throws a ModelException if the child-sub-product-category is not found.
   *
   * @param {string} id - The id of the child-sub-product-category entity to update.
   * @param {any} data - The data used to update the child-sub-product-category entity.
   * @return {Promise<any>} A promise that resolves to the updated child-sub-product-category entity.
   * @throws {ModelException} Throws a ModelException if the child-sub-product-category entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single child-sub-product-category entity based on the provided id and data.
      // The childSubCategoryRepository's update method is used to update the child-sub-product-category entity.
      return await this.childSubCategoryRepository.update({id}, data);
    } catch (error) {
      // If the child-sub-product-category entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single child-sub-product-category entity based on the provided data.
   * Throws a ModelException if there is an error saving the child-sub-product-category.
   *
   * @param {any} data - The data used to save the child-sub-product-category.
   * @return {Promise<any>} A promise that resolves to the saved child-sub-product-category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the child-sub-product-category.
   */
  async insert(data: any): Promise<any> {
    try {
      // Saves a single child-sub-product-category entity based on the provided data.
      // The childSubCategoryRepository's save method is used to save the child-sub-product-category entity.
      return await this.childSubCategoryRepository.insert(data);
    } catch (error) {
      // If there is an error saving the child-sub-product-category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves a single child-sub-product-category entity based on the provided data.
   * Throws a ModelException if there is an error saving the child-sub-product-category.
   *
   * @param {any} data - The data used to save the child-sub-product-category.
   * @return {Promise<any>} A promise that resolves to the saved child-sub-product-category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the child-sub-product-category.
   */
  async save(data: any): Promise<any> {
    try {
      // Saves a single child-sub-product-category entity based on the provided data.
      // The childSubCategoryRepository's save method is used to save the child-sub-product-category entity.
      return await this.childSubCategoryRepository.save(data);
    } catch (error) {
      // If there is an error saving the child-sub-product-category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves multiple child-sub-product-category entities based on the provided data.
   * Throws a ModelException if there is an error saving the child-sub-product-categories.
   *
   * @param {any[]} data - An array of data used to save the child-sub-product-categories.
   * @return {Promise<any>} A promise that resolves to an array of saved child-sub-product-categories.
   * @throws {ModelException} Throws a ModelException if there is an error saving the child-sub-product-categories.
   */
  async saveMany(data: any[]): Promise<any> {
    try {
      // Inserts multiple child-sub-product-category entities based on the provided data.
      // The brandRepository's insert method is used to save the child-sub-product-category entities.
      return await this.childSubCategoryRepository.insert(data);
    } catch (error) {
      // If there is an error saving the child-sub-product-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single child-sub-product-category entity based on the provided id.
   *
   * @param {string} id - The id of the child-sub-product-category entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single child-sub-product-category entity based on the provided id.
    // The childSubCategoryRepository's delete method is used to delete the child-sub-product-category entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.childSubCategoryRepository.delete(id);
  }
}
