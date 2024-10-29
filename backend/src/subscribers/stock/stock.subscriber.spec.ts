import { Test, TestingModule } from '@nestjs/testing';
import { StockSubscriber } from './stock.subscriber';

describe('StockSubscriber', () => {
  let controller: StockSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockSubscriber],
    }).compile();

    controller = module.get<StockSubscriber>(StockSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
