import { Test, TestingModule } from '@nestjs/testing';
import { PriceSubscriber } from './price.subscriber';

describe('PriceSubscriber', () => {
  let controller: PriceSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceSubscriber],
    }).compile();

    controller = module.get<PriceSubscriber>(PriceSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
