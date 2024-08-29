import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { JsonDbModule } from 'src/db/json-db.module';

@Module({
  providers: [GenresService],
  imports: [JsonDbModule],
  exports: [GenresService],
})
export class GenresModule {}
