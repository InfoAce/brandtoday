import { Test, TestingModule } from '@nestjs/testing';
import { AmrodService } from './amrod.service';

describe('AmrodService', () => {
  let service: AmrodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrodService],
    }).compile();

    service = module.get<AmrodService>(AmrodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
