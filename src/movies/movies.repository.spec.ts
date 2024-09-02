import { Test, TestingModule } from '@nestjs/testing';
import { ERR_MOVIE_EXISTS, MoviesRepository } from './movies.repository';
import { JsonDbService } from '../db/json-db.service';
import { MovieEntity } from './movie.entity';
import { MovieDto } from './dto/movie.dto';

describe(MoviesRepository.name, () => {
  let repository: MoviesRepository;
  let getMoviesSpy: jest.Mock;
  let countSpy: jest.Mock;
  let findMovieBySpy: jest.Mock;
  let addMovieSpy: jest.Mock;
  let fixtures: ReturnType<typeof getFixtures>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesRepository,
        {
          provide: JsonDbService,
          useValue: {
            getMovies: (filter: (value: MovieEntity) => boolean) =>
              getMoviesSpy(filter),
            count: () => countSpy(),
            findMovieBy: (pred: (value: MovieEntity) => boolean) =>
              findMovieBySpy(pred),
            addMovie: (movieEntity: MovieEntity) => addMovieSpy(movieEntity),
          },
        },
      ],
    }).compile();

    repository = module.get<MoviesRepository>(MoviesRepository);
    fixtures = getFixtures();
    fixtures.resetMovieDb();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return a movie by given filter', () => {
    fixtures.given.movie.get();

    const result = fixtures.when.gettingMoviesByTitle();

    fixtures.then.movieArrayIsReturned(result);
  });

  it('should count movies', () => {
    fixtures.given.movie.count();

    const result = fixtures.when.countingMovies();

    expect(result).toBe(1);
  });

  it('should return a movie by id', () => {
    fixtures.given.movie.getMovieById();

    const result = fixtures.when.gettingMovieById();

    fixtures.then.movieIsReturned(result);
  });

  it('should add a movie', () => {
    fixtures.given.movie.add();
    fixtures.given.movie.count();
    expect(fixtures.when.countingMovies()).toBe(1);

    const result = fixtures.when.addingMovie();

    expect(result).toBeUndefined();
    expect(fixtures.when.countingMovies()).toBe(2);
  });

  it('should throw an error when trying to add a movie that already exists', () => {
    fixtures.given.movie.add();
    fixtures.given.movie.count();
    expect(fixtures.when.countingMovies()).toBe(1);

    const result = fixtures.when.addingExistingMovie();

    fixtures.then.symbolIsReturned(result);
    expect(fixtures.when.countingMovies()).toBe(1);
  });

  const getFixtures = () => {
    const movieEntity: MovieEntity = {
      id: 1,
      title: 'Test Movie',
      actors: 'Test Actor',
      director: 'Test Director',
      genres: ['Test Genre'],
      runtime: '120',
      year: '2021',
      plot: 'Test Plot',
      posterUrl: 'Test Poster URL',
    };

    const newMovieDto: MovieDto = {
      title: 'New Movie',
      actors: 'New Actor',
      director: 'New Director',
      genres: ['New Genre'],
      runtime: '120',
      year: '2021',
    };

    let inMemoryMovies = [movieEntity];

    return {
      given: {
        movie: {
          entity: movieEntity,
          dto: newMovieDto,
          get: () => {
            getMoviesSpy = jest
              .fn()
              .mockImplementation((filter) => inMemoryMovies.filter(filter));
          },
          count: () => {
            countSpy = jest
              .fn()
              .mockImplementation(() => inMemoryMovies.length);
          },
          getMovieById: () => {
            findMovieBySpy = jest
              .fn()
              .mockImplementation((pred: (value: MovieEntity) => boolean) =>
                inMemoryMovies.find(pred),
              );
          },
          add: () => {
            addMovieSpy = jest
              .fn()
              .mockImplementation((movieEntity: MovieEntity) => {
                inMemoryMovies.push(movieEntity);
              });
          },
        },
      },
      when: {
        gettingMoviesByTitle: () =>
          repository.get((m) => m.title === movieEntity.title),
        countingMovies: () => repository.count(),
        gettingMovieById: () => repository.getMovieById(1),
        addingMovie: () => repository.add(newMovieDto),
        addingExistingMovie: () =>
          repository.add(Object.assign(new MovieDto(), movieEntity)),
      },
      then: {
        movieArrayIsReturned: (result: MovieEntity[]) => {
          expect(result).toEqual([movieEntity]);
        },
        movieIsReturned: (result: MovieEntity) => {
          expect(result).toEqual(movieEntity);
        },
        symbolIsReturned: (result: void | typeof ERR_MOVIE_EXISTS) => {
          expect(result).toBe(ERR_MOVIE_EXISTS);
        },
      },
      resetMovieDb: () => (inMemoryMovies = [movieEntity]),
    };
  };
});
