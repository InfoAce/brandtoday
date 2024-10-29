import { Test, TestingModule } from '@nestjs/testing';
import { ProductSubscriber } from './product.subscriber';

describe('ProductSubscriber', () => {
  let controller: ProductSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSubscriber],
    }).compile();

    controller = module.get<ProductSubscriber>(ProductSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
