import { JsonDbService } from 'src/db/json-db.service';
import { MovieEntity } from 'src/movies/movie.entity';

import { Injectable } from '@nestjs/common';
import { Entity } from 'src/db/entity.enum';
import { MovieDto } from './dto/movie.dto';

export const ERR_MOVIE_EXISTS = Symbol('Movie already exists');

@Injectable()
export class MoviesRepository {
  constructor(private readonly dbService: JsonDbService) {}

  get(filter: (value: MovieEntity) => boolean): MovieEntity[] {
    return this.dbService.getMovies(filter);
  }

  count(): number {
    return this.dbService.count(Entity.movies);
  }

  getMovieById(id: number): MovieEntity {
    return this.dbService.findMovieBy((m) => m.id === id);
  }

  add(movie: MovieDto): void | typeof ERR_MOVIE_EXISTS {
    const existingMovie = this.dbService.findMovieBy(
      (m) => m.title === movie.title,
    );

    if (existingMovie) {
      return ERR_MOVIE_EXISTS;
    }

    this.dbService.addMovie(this.transformForDb(movie));
  }

  private transformForDb(movie: MovieDto): MovieEntity {
    const nextId = this.dbService.count(Entity.movies) + 1;

    return {
      id: nextId,
      ...movie,
      actors: movie.actors ?? '',
      plot: movie.plot ?? '',
      posterUrl: movie.posterUrl ?? '',
    };
  }
}
