import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColourEntity } from '../entities';
import { ColourRepository } from '../repositories';

@Injectable()
export default class ColourModel extends ColourRepository {
  /**
   * The ColourModel class extends the ColourRepository class and injects the ColourRepository.
   * It provides methods to perform CRUD operations on the ColourEntity.
   */
  constructor(
    /**
     * The ColourRepository object.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ColourEntity.
     */
    @InjectRepository(ColourEntity)
    private repository: ColourRepository,
  ) {
    /**
     * The constructor calls the superclass constructor and passes in the repository,
     * manager and queryRunner objects.
     */
    super(repository.target, repository.manager, repository.queryRunner) 
  }
  
}
