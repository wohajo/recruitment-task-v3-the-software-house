import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { GenresValidator } from './genres-validator';

describe(GenresValidator.name, () => {
  let service: GenresService;
  let validator: GenresValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresValidator,
        {
          provide: GenresService,
          useValue: {
            getGenres: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    validator = new GenresValidator(service);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });
});
