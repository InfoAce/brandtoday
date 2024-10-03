import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities';
import { CompanyRepository } from '../repositories';
import { first } from 'lodash';

@Injectable()
export default class CompanyModel extends CompanyRepository{
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: CompanyRepository,
  ) {
    super(companyRepository.target, companyRepository.manager, companyRepository.queryRunner) 
  }

  async first(): Promise<CompanyEntity>{
    return first(await this.companyRepository.find());
  }
}
