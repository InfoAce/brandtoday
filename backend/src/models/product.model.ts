import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities';
import { ProductRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class ProductModel {
/**
 * BrandModel constructor.
 * 
 * @param productRepository - The product repository.
 */
constructor(
  /**
   * The product repository.
   * This repository is injected by NestJS using the @InjectRepository decorator.
   * It is used to perform database operations related to the ProductEntity.
   */
  @InjectRepository(ProductEntity)
  private productRepository: ProductRepository,
) {}

/**
 * Finds multiple product entities based on the provided data.
 *
 * @param {any} data - The data used to find the products.
 * @return {Promise<ProductEntity[]>} A promise that resolves to an array of found products.
 * @throws {ModelException} Throws a ModelException if there is an error finding the products.
 */
async find(data: object = {}): Promise<ProductEntity[]> {
  try {
    // Find multiple product entities based on the provided data.
    // The find method of the productRepository is used to find the products.
    return await this.productRepository.find(data);
  } catch (error) {
    // If there is an error finding the products, throw a ModelException with the error message.
    throw new ModelException(error);
  }
}

/**
 * Finds a single product entity based on the provided data.
 * Throws a ModelException if the product is not found.
 *
 * @param {any} data - The data used to find the product.
 * @return {Promise<ProductEntity>} A promise that resolves to the found product.
 * @throws {ModelException} Throws a ModelException if the product is not found.
 */
async findOne(data: any): Promise<ProductEntity> {
  try {
    // Finds a single product entity based on the provided data and throws an exception if it is not found.
    // The findOneOrFail method of the productRepository is used to find the product entity.
    return await this.productRepository.findOneOrFail(data);
  } catch (error) {
    // If the product is not found, throw a ModelException with the error message.
    throw new ModelException(error);
  }
}

/**
 * Paginates the product entities based on the provided pagination options.
 *
 * @param {IPaginationOptions} options - The pagination options.
 * @return {Promise<Pagination<ProductEntity>>} A promise that resolves to the paginated product entities.
 */
async paginate(
  options: IPaginationOptions,
): Promise<Pagination<ProductEntity>> {
  // Paginates the product entities using the paginate function from the 'nestjs-typeorm-paginate' library.
  // The productRepository is passed as the first argument, and the options are passed as the second argument.
  return paginate<ProductEntity>(this.productRepository, options);
}

/**
 * Updates a single product entity based on the provided id and data.
 * Throws a ModelException if the product is not found.
 *
 * @param {string} id - The id of the product entity to update.
 * @param {any} data - The data used to update the product entity.
 * @return {Promise<any>} A promise that resolves to the updated product entity.
 * @throws {ModelException} Throws a ModelException if the product entity is not found.
 */
async updateOne(id: string, data: any): Promise<any> {
  try {
    // Updates a single product entity based on the provided id and data.
    // The productRepository's update method is used to update the product entity.
    return await this.productRepository.update({id}, data);
  } catch (error) {
    // If the product entity is not found, throw a ModelException with the error message.
    throw new ModelException(error);
  } 
}

/**
 * Saves a single product entity based on the provided data.
 * Throws a ModelException if there is an error saving the product.
 *
 * @param {any} data - The data used to save the product.
 * @return {Promise<any>} A promise that resolves to the saved product.
 * @throws {ModelException} Throws a ModelException if there is an error saving the product.
 */
async save(data: any): Promise<any> {
  try {
    // Saves a single product entity based on the provided data.
    // The productRepository's save method is used to save the product entity.
    return await this.productRepository.save(data);
  } catch (error) {
    // If there is an error saving the product, throw a ModelException with the error message.
    throw new ModelException(error);
  }
}

/**
 * Saves a single product entity based on the provided data.
 * Throws a ModelException if there is an error saving the product.
 *
 * @param {any} data - The data used to save the product.
 * @return {Promise<any>} A promise that resolves to the saved product.
 * @throws {ModelException} Throws a ModelException if there is an error saving the product.
 */
async insert(data: any): Promise<any> {
  try {
    // Save a single product entity by calling the insert method of the productRepository.
    // The insert method is used to insert a new product entity into the database.
    return await this.productRepository.insert(data);
  } catch (error) {
    // If there is an error saving the product, throw a ModelException with the error message.
    throw new ModelException(error);
  }
}

/**
 * Saves multiple product entities based on the provided data.
 * Throws a ModelException if there is an error saving the products.
 *
 * @param {any[]} data - An array of data used to save the products.
 * @return {Promise<any>} A promise that resolves to an array of saved products.
 * @throws {ModelException} Throws a ModelException if there is an error saving the products.
 */
  async saveMany(data: any[]): Promise<any> {
    try {
      // Inserts multiple product entities based on the provided data.
      // The brandRepository's insert method is used to save the product entities.
      return await this.productRepository.insert(data);
    } catch (error) {
      // If there is an error saving the products, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single product entity based on the provided id.
   *
   * @param {string} id - The id of the product entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single product entity based on the provided id.
    // The productRepository's delete method is used to delete the product entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.productRepository.delete(id);
  }
}
