import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { MovieEntity } from './movie.entity';
import { MoviesFiltersDto } from './dto/filters.dto';
import { MovieDto } from './dto/movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let getSpy: jest.Mock<any, any>;
  let addMovieSpy: jest.Mock<any, any>;
  let countSpy: jest.Mock<any, any>;
  let getMovieByIdSpy: jest.Mock<any, any>;
  let fixtures: ReturnType<typeof getFixtures>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: {
            get: (filter: (value: MovieEntity) => boolean) => getSpy(filter),
            add: (movie: MovieDto) => addMovieSpy(movie),
            count: () => countSpy(),
            getMovieById: (id: number) => getMovieByIdSpy(id),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    fixtures = getFixtures();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a random movie', () => {
    fixtures.given.movies.count();
    fixtures.given.movies.getMovieById();

    const result = fixtures.when.gettingMovies({});
    fixtures.then.movieIsReturned(result);
  });

  it('should sort movies by genres', () => {
    const { given, when } = fixtures;
    const desiredGenresArray = given.genres.array;
    const moviesArray = given.movies.array;

    const result = when.sortingMoviesByGenres(moviesArray, desiredGenresArray);

    // expect first movie to be the one with the most common genres
    expect(result[0].genres).toEqual(desiredGenresArray);
  });

  it('should return filtered movies', () => {
    const filters = fixtures.given.movies.filters;
    fixtures.given.movies.get();

    const result = fixtures.when.gettingMovies(filters);

    fixtures.then.filteredMoviesAreReturned(result);
  });

  it('should add a movie', () => {
    fixtures.given.movies.add();

    fixtures.when.addingMovie();

    fixtures.then.movieWasAdded();
  });

  const getFixtures = () => {
    const mockMovies: MovieEntity[] = [
      {
        id: 1,
        title: 'Inception',
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        runtime: '148',
        year: '2010',
        director: 'Christopher Nolan',
        actors: 'Christopher Nolan, Morgan Freeman, Anurag Kashyap',
        plot: 'The story revolves around the protagonist, Dom Cobb, a skilled thief who is framed for a crime he did not commit.',
        posterUrl: '',
      },
      {
        id: 2,
        title: 'The Shawshank Redemption',
        genres: ['Action', 'Drama'],
        runtime: '93',
        year: '1994',
        director: 'Frank Darabont',
        actors: 'Tim Robbins, Morgan Freeman, Bob Gunton ',
        plot: 'The story of Andy Dufresne, a banker who is sentenced to life in Shawshank State Pen Submission State.',
        posterUrl: '',
      },
      {
        id: 3,
        title: 'Barbie',
        genres: ['Animation'],
        runtime: '90',
        year: '2021',
        director: 'Greta Gerwig',
        actors: 'Margot Robbie, Ryan Gosling, Idris Elba',
        plot: '...',
        posterUrl: '',
      },
    ];

    return {
      given: {
        genres: {
          array: ['Action', 'Drama'],
        },
        movies: {
          filters: {
            genres: ['Animation'],
            duration: 90,
          } satisfies MoviesFiltersDto,
          array: mockMovies,
          count: () => {
            countSpy = jest.fn().mockReturnValue(mockMovies.length);
          },
          get: () => {
            getSpy = jest
              .fn()
              .mockImplementation((filter: (value: MovieEntity) => boolean) =>
                mockMovies.filter(filter),
              );
          },
          getMovieById: () => {
            getMovieByIdSpy = jest
              .fn()
              .mockImplementation((id: number) => mockMovies[id - 1]);
          },
          add: () => {
            addMovieSpy = jest.fn();
          },
        },
      },
      when: {
        gettingMovies: (filters: MoviesFiltersDto) => service.get(filters),
        sortingMoviesByGenres: (movies: MovieEntity[], genres: string[]) =>
          service['sortMoviesByGenres'](movies, genres),
        addingMovie: () => service.addMovie(mockMovies[0]),
      },
      then: {
        movieIsReturned: (result: MovieEntity | MovieEntity[]) => {
          expect(mockMovies).toContain(result);
        },
        filteredMoviesAreReturned: (result: MovieEntity | MovieEntity[]) => {
          expect(result).toEqual([mockMovies[2]]);
        },
        movieWasAdded: () => {
          expect(addMovieSpy).toHaveBeenCalledWith(mockMovies[0]);
        },
      },
    };
  };
});
