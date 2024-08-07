import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryEntity } from '../entities';
import { SubCategoryRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class SubCategoryModel {
  /**
   * BrandModel constructor.
   * 
   * @param subCategoryRepository - The sub-category repository.
   */
  constructor(
    /**
     * The sub-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the SubCategoryEntity.
     */
    @InjectRepository(SubCategoryEntity)
    private subCategoryRepository: SubCategoryRepository,
  ) {}
  
  /**
   * Finds multiple sub-category entities based on the provided data.
   *
   * @param {any} data - The data used to find the sub-categories.
   * @return {Promise<SubCategoryEntity[]>} A promise that resolves to an array of found sub-categories.
   * @throws {ModelException} Throws a ModelException if there is an error finding the sub-categories.
   */
  async find(data: any): Promise<SubCategoryEntity[]> {
    try {
      // Find multiple sub-category entities based on the provided data.
      // The find method of the subCategoryRepository is used to find the sub-categories.
      return await this.subCategoryRepository.find(data);
    } catch (error) {
      // If there is an error finding the sub-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Finds a single sub-category entity based on the provided data.
   * Throws a ModelException if the sub-category is not found.
   *
   * @param {any} data - The data used to find the sub-category.
   * @return {Promise<SubCategoryEntity>} A promise that resolves to the found sub-category.
   * @throws {ModelException} Throws a ModelException if the sub-category is not found.
   */
  async findOne(data: any): Promise<SubCategoryEntity> {
    try {
      // Finds a single sub-category entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the subCategoryRepository is used to find the sub-category entity.
      return await this.subCategoryRepository.findOneOrFail(data);
    } catch (error) {
      // If the sub-category is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the sub-category entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<SubCategoryEntity>>} A promise that resolves to the paginated sub-category entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<SubCategoryEntity>> {
    // Paginates the sub-category entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The subCategoryRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<SubCategoryEntity>(this.subCategoryRepository, options);
  }

  /**
   * Updates a single sub-category entity based on the provided id and data.
   * Throws a ModelException if the sub-category is not found.
   *
   * @param {string} id - The id of the sub-category entity to update.
   * @param {any} data - The data used to update the sub-category entity.
   * @return {Promise<any>} A promise that resolves to the updated sub-category entity.
   * @throws {ModelException} Throws a ModelException if the sub-category entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single sub-category entity based on the provided id and data.
      // The subCategoryRepository's update method is used to update the sub-category entity.
      return await this.subCategoryRepository.update({id}, data);
    } catch (error) {
      // If the sub-category entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single sub-category entity based on the provided data.
   * Throws a ModelException if there is an error saving the sub-category.
   *
   * @param {any} data - The data used to save the sub-category.
   * @return {Promise<any>} A promise that resolves to the saved sub-category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the sub-category.
   */
  async insert(data: any): Promise<any> {
    try {
      // Saves a single sub-category entity based on the provided data.
      // The subCategoryRepository's save method is used to save the sub-category entity.
      return await this.subCategoryRepository.insert(data);
    } catch (error) {
      // If there is an error saving the sub-category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves a single sub-category entity based on the provided data.
   * Throws a ModelException if there is an error saving the sub-category.
   *
   * @param {any} data - The data used to save the sub-category.
   * @return {Promise<any>} A promise that resolves to the saved sub-category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the sub-category.
   */
  async save(data: any): Promise<any> {
    try {
      // Saves a single sub-category entity based on the provided data.
      // The subCategoryRepository's save method is used to save the sub-category entity.
      return await this.subCategoryRepository.save(data);
    } catch (error) {
      // If there is an error saving the sub-category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves multiple sub-category entities based on the provided data.
   * Throws a ModelException if there is an error saving the sub-categories.
   *
   * @param {any[]} data - An array of data used to save the sub-categories.
   * @return {Promise<any>} A promise that resolves to an array of saved sub-categories.
   * @throws {ModelException} Throws a ModelException if there is an error saving the sub-categories.
   */
  async saveMany(data: any[]): Promise<any> {
    try {
      // Inserts multiple sub-category entities based on the provided data.
      // The brandRepository's insert method is used to save the sub-category entities.
      return await this.subCategoryRepository.insert(data);
    } catch (error) {
      // If there is an error saving the sub-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single sub-category entity based on the provided id.
   *
   * @param {string} id - The id of the sub-category entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single sub-category entity based on the provided id.
    // The subCategoryRepository's delete method is used to delete the sub-category entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.subCategoryRepository.delete(id);
  }
}
