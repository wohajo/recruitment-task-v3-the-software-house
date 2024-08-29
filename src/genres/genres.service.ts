import { Injectable } from '@nestjs/common';
import { JsonDbService } from 'src/db/json-db.service';

@Injectable()
export class GenresService {
  constructor(private readonly dbService: JsonDbService) {}

  getGenres() {
    return this.dbService.getGenres();
  }
}
