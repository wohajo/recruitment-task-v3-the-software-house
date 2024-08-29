import { Injectable } from '@nestjs/common';
import { JsonDbService } from '../db/json-db.service';

@Injectable()
export class GenresService {
  constructor(private readonly jsonDbService: JsonDbService) {}

  getGenres() {
    return this.jsonDbService.getGenres();
  }
}
