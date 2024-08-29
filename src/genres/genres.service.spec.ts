import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { JsonDbService } from '../db/json-db.service';

describe(GenresService.name, () => {
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: JsonDbService,
          useValue: {
            getGenres: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
