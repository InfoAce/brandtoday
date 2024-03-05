import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
@Injectable()
export default class UserModel {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async findOneBy(data: object): Promise<UserEntity> {
    return await this.usersRepository.findOneOrFail({ where: data });
  }
  
  async save(data: any): Promise<any>{
    return await this.usersRepository.save(data);
  }

  async updateOne(find:any, data: any): Promise<any>{
    return await this.usersRepository.update(find,data);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
