import Lowdb, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Entity } from './entity.enum';
import { GenreEntity } from '../genres/genre.entity';
import { MovieEntity } from '../movies/movie.entity';

export type Entities = {
  [Entity.movies]: MovieEntity[];
  [Entity.genres]: GenreEntity[];
};

@Injectable()
export class DbService {
  private dbFilePath: string;
  private db: LowdbSync<Entities>;

  constructor(private configService: ConfigService) {
    this.dbFilePath = this.configService.get<string>('DB_FILE_PATH');
    this.db = Lowdb(new FileSync<Entities>(this.dbFilePath));
  }

  public getMovies(pred: (value: MovieEntity) => boolean) {
    return this.db.get(Entity.movies).filter(pred).value();
  }

  public findMovieBy(pred: (value: MovieEntity) => boolean) {
    return this.db.get(Entity.movies).find(pred).value();
  }

  public addMovie(movie: MovieEntity) {
    this.db.get(Entity.movies).push(movie).write();
  }

  public getSize(entity: Entity) {
    return this.db.get(entity).size().value();
  }

  public getGenres() {
    return this.db.get(Entity.genres).value();
  }
}
