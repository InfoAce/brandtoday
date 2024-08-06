import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from '../entities';
import { ProductCategorytRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class ProductCategoryModel {
  /**
   * BrandModel constructor.
   * 
   * @param productCategorytRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ProductCategoryEntity.
     */
    @InjectRepository(ProductCategoryEntity)
    private productCategorytRepository: ProductCategorytRepository,
  ) {}
  
  /**
   * Finds multiple brand entities based on the provided data.
   *
   * @param {any} data - The data used to find the brands.
   * @return {Promise<ProductCategoryEntity[]>} A promise that resolves to an array of found brands.
   * @throws {ModelException} Throws a ModelException if there is an error finding the brands.
   */
  async find(data: any): Promise<ProductCategoryEntity[]> {
    try {
      // Find multiple brand entities based on the provided data.
      // The find method of the productCategorytRepository is used to find the brands.
      return await this.productCategorytRepository.find(data);
    } catch (error) {
      // If there is an error finding the brands, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

    /**
   * Finds multiple brand entities based on the provided data.
   *
   * @param {any} data - The data used to find the brands.
   * @return {Promise<ProductCategoryEntity[]>} A promise that resolves to an array of found brands.
   * @throws {ModelException} Throws a ModelException if there is an error finding the brands.
   */
    async findCount(data: any): Promise<Array<any>> {
      try {
        // Find multiple brand entities based on the provided data.
        // The find method of the productCategorytRepository is used to find the brands.
        return await this.productCategorytRepository.findAndCount(data)
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
   * @return {Promise<ProductCategoryEntity>} A promise that resolves to the found brand.
   * @throws {ModelException} Throws a ModelException if the brand is not found.
   */
  async findOne(data: any): Promise<ProductCategoryEntity> {
    try {
      // Finds a single brand entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the productCategorytRepository is used to find the brand entity.
      return await this.productCategorytRepository.findOneOrFail(data);
    } catch (error) {
      // If the brand is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the brand entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<ProductCategoryEntity>>} A promise that resolves to the paginated brand entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ProductCategoryEntity>> {
    // Paginates the brand entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The productCategorytRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<ProductCategoryEntity>(this.productCategorytRepository, options);
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
      // The productCategorytRepository's update method is used to update the brand entity.
      return await this.productCategorytRepository.update({id}, data);
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
      // The productCategorytRepository's save method is used to save the brand entity.
      return await this.productCategorytRepository.save(data);
    } catch (error) {
      console.log(error);
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
    // The productCategorytRepository's delete method is used to delete the brand entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.productCategorytRepository.delete(id);
  }
}
