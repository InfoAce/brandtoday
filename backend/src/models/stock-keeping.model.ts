import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockKeepingEntity } from '../entities';
import { StockKeepingRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class StockKeepingModel {
  /**
   * BrandModel constructor.
   * 
   * @param stockKeepingRepository - The stock repository.
   */
  constructor(
    /**
     * The stock repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the StockKeepingEntity.
     */
    @InjectRepository(StockKeepingEntity)
    private stockKeepingRepository: StockKeepingRepository,
  ) {}
  
  /**
   * Finds multiple stock entities based on the provided data.
   *
   * @param {any} data - The data used to find the stocks.
   * @return {Promise<StockKeepingEntity[]>} A promise that resolves to an array of found stocks.
   * @throws {ModelException} Throws a ModelException if there is an error finding the stocks.
   */
  async find(data: any): Promise<StockKeepingEntity[]> {
    try {
      // Find multiple stock entities based on the provided data.
      // The find method of the stockKeepingRepository is used to find the stocks.
      return await this.stockKeepingRepository.find(data);
    } catch (error) {
      // If there is an error finding the stocks, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Finds a single stock entity based on the provided data.
   * Throws a ModelException if the stock is not found.
   *
   * @param {any} data - The data used to find the stock.
   * @return {Promise<StockKeepingEntity>} A promise that resolves to the found stock.
   * @throws {ModelException} Throws a ModelException if the stock is not found.
   */
  async findOne(data: any): Promise<StockKeepingEntity> {
    try {
      // Finds a single stock entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the stockKeepingRepository is used to find the stock entity.
      return await this.stockKeepingRepository.findOneOrFail(data);
    } catch (error) {
      // If the stock is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the stock entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<StockKeepingEntity>>} A promise that resolves to the paginated stock entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<StockKeepingEntity>> {
    // Paginates the stock entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The stockKeepingRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<StockKeepingEntity>(this.stockKeepingRepository, options);
  }

  /**
   * Updates a single stock entity based on the provided id and data.
   * Throws a ModelException if the stock is not found.
   *
   * @param {string} id - The id of the stock entity to update.
   * @param {any} data - The data used to update the stock entity.
   * @return {Promise<any>} A promise that resolves to the updated stock entity.
   * @throws {ModelException} Throws a ModelException if the stock entity is not found.
   */
  async updateOne(id: string, data: any): Promise<any> {
    try {
      // Updates a single stock entity based on the provided id and data.
      // The stockKeepingRepository's update method is used to update the stock entity.
      return await this.stockKeepingRepository.update({id}, data);
    } catch (error) {
      // If the stock entity is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    } 
  }

  /**
   * Saves a single stock entity based on the provided data.
   * Throws a ModelException if there is an error saving the stock.
   *
   * @param {any} data - The data used to save the stock.
   * @return {Promise<any>} A promise that resolves to the saved stock.
   * @throws {ModelException} Throws a ModelException if there is an error saving the stock.
   */
  async save(data: any): Promise<any> {
    try {
      // Saves a single stock entity based on the provided data.
      // The stockKeepingRepository's save method is used to save the stock entity.
      return await this.stockKeepingRepository.save(data);
    } catch (error) {
      // If there is an error saving the stock, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Saves multiple stock entities based on the provided data.
   * Throws a ModelException if there is an error saving the stocks.
   *
   * @param {any[]} data - An array of data used to save the stocks.
   * @return {Promise<any>} A promise that resolves to an array of saved stocks.
   * @throws {ModelException} Throws a ModelException if there is an error saving the stocks.
   */
  async insert(data: any): Promise<any> {
    try {
      // Inserts multiple stock entities based on the provided data.
      // The stockKeepingRepository's insert method is used to save the stock entities.
      return await this.stockKeepingRepository.insert(data);
    } catch (error) {
      // If there is an error saving the stocks, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Deletes a single stock entity based on the provided id.
   *
   * @param {string} id - The id of the stock entity to delete.
   * @return {Promise<DeleteResult>} A promise that resolves to the DeleteResult object.
   * The DeleteResult object contains information about the affected rows and the generated identifier.
   */
  async remove(id: string): Promise<DeleteResult> {
    // Deletes a single stock entity based on the provided id.
    // The stockKeepingRepository's delete method is used to delete the stock entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.stockKeepingRepository.delete(id);
  }
}
