import { Test, TestingModule } from '@nestjs/testing';
import { OrderSubscriber } from './order.subscriber';

describe('OrderSubscriber', () => {
  let controller: OrderSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderSubscriber],
    }).compile();

    controller = module.get<OrderSubscriber>(OrderSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
