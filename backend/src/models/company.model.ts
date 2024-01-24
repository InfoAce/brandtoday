import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities';
import { CompanyRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import { first } from 'lodash';

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
