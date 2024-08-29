import { JsonDbModule } from 'src/db/json-db.module';

import { Module } from '@nestjs/common';

import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';
import { GenresModule } from 'src/genres/genres.module';

@Module({
  imports: [JsonDbModule, GenresModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
})
export class MoviesModule {}
