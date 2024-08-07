import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from '../entities';
import { StockRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class StockModel {
  /**
   * BrandModel constructor.
   * 
   * @param stockRepository - The stock repository.
   */
  constructor(
    /**
     * The stock repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the StockEntity.
     */
    @InjectRepository(StockEntity)
    private stockRepository: StockRepository,
  ) {}
  
  /**
   * Finds multiple stock entities based on the provided data.
   *
   * @param {any} data - The data used to find the stocks.
   * @return {Promise<StockEntity[]>} A promise that resolves to an array of found stocks.
   * @throws {ModelException} Throws a ModelException if there is an error finding the stocks.
   */
  async find(data: any): Promise<StockEntity[]> {
    try {
      // Find multiple stock entities based on the provided data.
      // The find method of the stockRepository is used to find the stocks.
      return await this.stockRepository.find(data);
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
   * @return {Promise<StockEntity>} A promise that resolves to the found stock.
   * @throws {ModelException} Throws a ModelException if the stock is not found.
   */
  async findOne(data: any): Promise<StockEntity> {
    try {
      // Finds a single stock entity based on the provided data and throws an exception if it is not found.
      // The findOneOrFail method of the stockRepository is used to find the stock entity.
      return await this.stockRepository.findOneOrFail(data);
    } catch (error) {
      // If the stock is not found, throw a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  /**
   * Paginates the stock entities based on the provided pagination options.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @return {Promise<Pagination<StockEntity>>} A promise that resolves to the paginated stock entities.
   */
  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<StockEntity>> {
    // Paginates the stock entities using the paginate function from the 'nestjs-typeorm-paginate' library.
    // The stockRepository is passed as the first argument, and the options are passed as the second argument.
    return paginate<StockEntity>(this.stockRepository, options);
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
      // The stockRepository's update method is used to update the stock entity.
      return await this.stockRepository.update({id}, data);
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
      // The stockRepository's save method is used to save the stock entity.
      return await this.stockRepository.save(data);
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
  async saveMany(data: any[]): Promise<any> {
    try {
      // Inserts multiple stock entities based on the provided data.
      // The stockRepository's insert method is used to save the stock entities.
      return await this.stockRepository.insert(data);
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
    // The stockRepository's delete method is used to delete the stock entity.
    // The DeleteResult object contains information about the affected rows and the generated identifier.
    
    return await this.stockRepository.delete(id);
  }
}
