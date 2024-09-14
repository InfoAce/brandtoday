import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariantEntity } from '../entities';
import { ProductVariantRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class ProductVariantModel {
  /**
   * BrandModel constructor.
   * 
   * @param productVariantRepository - The product-category repository.
   */
  constructor(
    /**
     * The product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ProductVariantEntity.
     */
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: ProductVariantRepository,
  ) {}
  
  /**
   * Finds multiple product-category entities based on the provided data.
   *
   * @param {any} data - The data used to find the product-categories.
   * @return {Promise<ProductVariantEntity[]>} A promise that resolves to an array of found product-categories.
   * @throws {ModelException} Throws a ModelException if there is an error finding the product-categories.
   */
  async find(data: any = {}): Promise<ProductVariantEntity[]> {
    try {
      // Find multiple product-category entities based on the provided data.
      // The find method of the productVariantRepository is used to find the product-categories.
      return await this.productVariantRepository.find(data);
    } catch (error) {
      // If there is an error finding the product-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

    /**
   * Finds multiple product-category entities based on the provided data.
   *
   * @param {any} data - The data used to find the product-categories.
   * @return {Promise<ProductVariantEntity[]>} A promise that resolves to an array of found product-categories.
   * @throws {ModelException} Throws a ModelException if there is an error finding the product-categories.
   */
    async findCount(data: any = {}): Promise<Array<any>> {
      try {
        // Find multiple product-category entities based on the provided data.
        // The find method of the productVariantRepository is used to find the product-categories.
        return await this.productVariantRepository.findAndCount(data)
      } catch (error) {
        // If there is an error finding the product-categories, throw a ModelException with the error message.
        throw new ModelException(error);
      }
    }

  /**
   * Finds a single product-category entity based on the provided data.
   * Throws a ModelException if the product-category is not found.
   *
   * @param {any} data - The data used to find the product-category.
   * @return {Promise<ProductVariantEntity>} A promise that resolves to the found product-category.
   * @throws {ModelException} Throws a ModelException if the product-category is not found.
   */
  async findOne(data: any = {}): Promise<ProductVariantEntity> {
    try {
      // Finds a single product-category entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the productVariantRepository is used to find the product-category entity.
      return await this.productVariantRepository.findOneOrFail(data);
    } catch (error) {
      // If the product-category is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the product-category entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<ProductVariantEntity>>} A promise that resolves to the paginated product-category entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ProductVariantEntity>> {
    // Paginates the product-category entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The productVariantRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<ProductVariantEntity>(this.productVariantRepository, options);
  }

  /**
   * Updates a single product-category entity based on the provided id and data.
   * Throws a ModelException if the product-category is not found.
   *
   * @param {string} id - The id of the product-category entity to update.
   * @param {any} data - The data used to update the product-category entity.
   * @return {Promise<any>} A promise that resolves to the updated product-category entity.
   * @throws {ModelException} Throws a ModelException if the product-category entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single product-category entity based on the provided id and data.
      // The productVariantRepository's update method is used to update the product-category entity.
      return await this.productVariantRepository.update({id}, data);
    } catch (error) {
      // If the product-category entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single product-category entity based on the provided data.
   * Throws a ModelException if there is an error saving the product-category.
   *
   * @param {any} data - The data used to save the product-category.
   * @return {Promise<any>} A promise that resolves to the saved product-category.
   * @throws {ModelException} Throws a ModelException if there is an error saving the product-category.
   */
  async save(data: any = {}): Promise<any> {
    try {
      // Saves a single product-category entity based on the provided data.
      // The productVariantRepository's save method is used to save the product-category entity.
      return await this.productVariantRepository.save(data);
    } catch (error) {
      // If there is an error saving the product-category, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves multiple product-category entities based on the provided data.
   * Throws a ModelException if there is an error saving the product-categories.
   *
   * @param {any[]} data - An array of data used to save the product-categories.
   * @return {Promise<any>} A promise that resolves to an array of saved product-categories.
   * @throws {ModelException} Throws a ModelException if there is an error saving the product-categories.
   */
  async insert(data: any = {}): Promise<any> {
    try {
      // Inserts multiple product-category entities based on the provided data.
      // The brandRepository's insert method is used to save the product-category entities.
      return await this.productVariantRepository.insert(data);
    } catch (error) {
      // If there is an error saving the product-categories, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single product-category entity based on the provided id.
   *
   * @param {string} id - The id of the product-category entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single product-category entity based on the provided id.
    // The productVariantRepository's delete method is used to delete the product-category entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.productVariantRepository.delete(id);
  }
}
