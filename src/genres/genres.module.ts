import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { JsonDbModule } from '../db/json-db.module';

@Module({
  providers: [GenresService],
  imports: [JsonDbModule],
  exports: [GenresService],
})
export class GenresModule {}
