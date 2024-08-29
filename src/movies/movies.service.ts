import { Injectable } from '@nestjs/common';

import { MoviesRepository } from './movies.repository';
import { MovieEntity } from 'src/movies/movie.entity';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly movieRepository: MoviesRepository) {}

  get(filters: { genres?: string[]; duration?: number }) {
    if (!Object.keys(filters).length) {
      return this.getRandomMovie();
    } else {
      return this.getFilteredMovies(filters);
    }
  }

  addMovie(movie: MovieDto) {
    return this.movieRepository.add(movie);
  }

  private getFilteredMovies(filters: { genres?: string[]; duration?: number }) {
    const movies = this.movieRepository.get((movie) => {
      const { genres, duration } = filters;

      const matchesGenres = genres?.length
        ? genres.some((genre) => movie.genres.includes(genre))
        : true;

      const matchesDuration = duration
        ? duration - 10 <= Number(movie.runtime) &&
          Number(movie.runtime) <= duration + 10
        : true;

      return matchesGenres && matchesDuration;
    });

    if (filters.genres?.length) {
      return this.sortMoviesByGenres(movies, filters.genres);
    }

    return movies;
  }

  private sortMoviesByGenres(movies: MovieEntity[], genres: string[]) {
    return [...movies].sort((a: MovieEntity, b: MovieEntity) => {
      const commonGenresA = a.genres.filter((genre) =>
        genres.includes(genre),
      ).length;

      const commonGenresB = b.genres.filter((genre) =>
        genres.includes(genre),
      ).length;

      return commonGenresB - commonGenresA;
    });
  }

  private getRandomMovie() {
    const count = this.movieRepository.count();
    const randomId = Math.floor(Math.random() * count) + 1;

    return this.movieRepository.getMovieById(randomId);
  }
}
