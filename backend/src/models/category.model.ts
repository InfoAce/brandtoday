import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities';
import { CategoryRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class CategoryModel {
  /**
   * BrandModel constructor.
   * 
   * @param categoryRepository - The category repository.
   */
  constructor(
    /**
     * The category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the CategoryEntity.
     */
    @InjectRepository(CategoryEntity)
    private categoryRepository: CategoryRepository,
  ) {}
  
  /**
   * Finds multiple category entities based on the provided data.
   *
   * @param {any} data - The data used to find the categories.
   * @return {Promise<CategoryEntity[]>} A promise that resolves to an array of found categories.
   * @throws {ModelException} Throws a ModelException if there is an error finding the categories.
   */
  async find(data: any = {}): Promise<CategoryEntity[]> {
    try {
      // Find multiple category entities based on the provided data.
      // The find method of the categoryRepository is used to find the categories.
      return await this.categoryRepository.find(data);
    } catch (error) {
      // If there is an error finding the categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Finds a single category entity based on the provided data.
   * Throws a ModelException if the category is not found.
   *
   * @param {any} data - The data used to find the category.
   * @return {Promise<CategoryEntity>} A promise that resolves to the found category.
   * @throws {ModelException} Throws a ModelException if the category is not found.
   */
  async findOne(data: any): Promise<CategoryEntity> {
    try {
      // Finds a single category entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the categoryRepository is used to find the category entity.
      return await this.categoryRepository.findOneOrFail(data);
    } catch (error) {
      // If the category is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the category entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<CategoryEntity>>} A promise that resolves to the paginated category entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CategoryEntity>> {
    // Paginates the category entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The categoryRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<CategoryEntity>(this.categoryRepository, options);
  }

  /**
   * Updates a single category entity based on the provided id and data.
   * Throws a ModelException if the category is not found.
   *
   * @param {string} id - The id of the category entity to update.
   * @param {any} data - The data used to update the category entity.
   * @return {Promise<any>} A promise that resolves to the updated category entity.
   * @throws {ModelException} Throws a ModelException if the category entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single category entity based on the provided id and data.
      // The categoryRepository's update method is used to update the category entity.
      return await this.categoryRepository.update({id}, data);
    } catch (error) {
      // If the category entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single category entity based on the provided data.
   * Throws a ModelException if there is an error saving the category.
   *
   * @param {any} data - The data used to save the category.
   * @return {Promise<any>} A promise that resolves to the saved category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the category.
   */
  async insert(data: any): Promise<any> {
    try {
      // Saves a single category entity based on the provided data.
      // The categoryRepository's save method is used to save the category entity.
      return await this.categoryRepository.insert(data);
    } catch (error) {
      // If there is an error saving the category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves a single category entity based on the provided data.
   * Throws a ModelException if there is an error saving the category.
   *
   * @param {any} data - The data used to save the category.
   * @return {Promise<any>} A promise that resolves to the saved category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the category.
   */
  async save(data: any): Promise<any> {
    try {
      // Saves a single category entity based on the provided data.
      // The categoryRepository's save method is used to save the category entity.
      return await this.categoryRepository.save(data);
    } catch (error) {
      // If there is an error saving the category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves multiple category entities based on the provided data.
   * Throws a ModelException if there is an error saving the categories.
   *
   * @param {any[]} data - An array of data used to save the categories.
   * @return {Promise<any>} A promise that resolves to an array of saved categories.
   * @throws {ModelException} Throws a ModelException if there is an error saving the categories.
   */
  async insertMany(data: any[]): Promise<any> {
    try {
      // Inserts multiple category entities based on the provided data.
      // The brandRepository's insert method is used to save the category entities.
      return await this.categoryRepository.createQueryBuilder().insert().values(data).execute();
    } catch (error) {
      // If there is an error saving the categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single category entity based on the provided id.
   *
   * @param {string} id - The id of the category entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single category entity based on the provided id.
    // The categoryRepository's delete method is used to delete the category entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.categoryRepository.delete(id);
  }
}
