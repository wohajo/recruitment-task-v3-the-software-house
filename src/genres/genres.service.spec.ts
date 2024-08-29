import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { JsonDbService } from '../db/json-db.service';

describe(GenresService.name, () => {
  let service: GenresService;
  let getGenresSpy: jest.Mock<any, any>;

  let fixtures: ReturnType<typeof getFixtures>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: JsonDbService,
          useValue: {
            getGenres: () => getGenresSpy(),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    fixtures = getFixtures();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return genres', () => {
    fixtures.given.genres();

    const result = fixtures.when.getting();

    fixtures.then.genresAreReturned(result);
  });

  const getFixtures = () => {
    const genres = ['Comedy', 'Action', 'Drama'];

    return {
      given: {
        genres: () => {
          getGenresSpy = jest.fn().mockReturnValue(genres);
        },
      },
      when: {
        getting: () => service.getGenres(),
      },
      then: {
        genresAreReturned: (result: string[]) => expect(result).toEqual(genres),
      },
    };
  };
});
