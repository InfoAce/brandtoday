import { Test, TestingModule } from '@nestjs/testing';
import { ProductColourSubscriber } from './product-colour.subscriber';

describe('ProductColourSubscriber', () => {
  let controller: ProductColourSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductColourSubscriber],
    }).compile();

    controller = module.get<ProductColourSubscriber>(ProductColourSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
