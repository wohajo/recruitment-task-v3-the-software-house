import { Injectable } from '@nestjs/common';
import { JsonDbService } from '../db/json-db.service';

@Injectable()
export class GenresService {
  constructor(private readonly dbService: JsonDbService) {}

  getGenres() {
    return this.dbService.getGenres();
  }
}
