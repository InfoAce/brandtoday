import { Test, TestingModule } from '@nestjs/testing';
import { ApiProductsController } from './api.products.controller';

describe('HomeController', () => {
  let controller: ApiProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiProductsController],
    }).compile();

    controller = module.get<ApiProductsController>(ApiProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
