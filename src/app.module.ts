import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JsonDbModule } from './db/json-db.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [
    MoviesModule,
    JsonDbModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_FILE_PATH: Joi.string().required(),
      }),
    }),
    GenresModule,
  ],
})
export class AppModule {}
