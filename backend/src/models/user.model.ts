import { Catch, Injectable, Logger, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { has } from 'lodash';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryBuilder, QueryFailedError } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ModelException } from 'src/exceptions/model.exception';
import { NotFoundInterceptor } from 'src/interceptors';

class UserModelException extends ExceptionsHandler {}

@Injectable()
@Catch(QueryFailedError, EntityNotFoundError,CannotCreateEntityIdMapError)
export default class UserModel extends UserRepository {

  private readonly logger = new Logger(UserEntity.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
  ) {
    super(usersRepository.target, usersRepository.manager, usersRepository.queryRunner) 
  }
}
