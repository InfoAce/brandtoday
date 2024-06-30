import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities';
import { CompanyRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import { first } from 'lodash';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class CompanyModel {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: CompanyRepository,
  ) {}
  
  async find(data:any): Promise<CompanyEntity>{
    return await this.companyRepository.findOneOrFail(data);
  }

  async first(): Promise<CompanyEntity>{
    return first(await this.companyRepository.find());
  }

  /**
   * Finds a single company entity based on the provided data.
   *
   * @param {object} data - The data used to find the company entity.
   * @return {Promise<CompanyEntity>} A promise that resolves to the found company entity.
   * @throws {ModelException} Throws a ModelException if the company entity is not found.
   */
  async findOne(data: object): Promise<CompanyEntity>{
    try {
      // Finds a single company entity based on the provided data and throws an exception if it is not found.
      return await this.companyRepository.findOneByOrFail(data);
    } catch(error) {
      // Throws a ModelException with the error message.
      throw new ModelException(error);
    }
  }

  async updateOne(id: string, data: any): Promise<any>{
    return await this.companyRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    return await this.companyRepository.save(data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.companyRepository.delete(id);
  }
}
