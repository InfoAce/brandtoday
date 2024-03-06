import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteController } from './favourite.controller';

describe('CompanyController', () => {
  let controller: FavouriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteController],
    }).compile();

    controller = module.get<FavouriteController>(FavouriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
