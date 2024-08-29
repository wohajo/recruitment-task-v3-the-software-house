import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { MoviesService } from './movies.service';
import { ERR_MOVIE_EXISTS } from './movies.repository';
import { MoviesFiltersDto } from './dto/filters.dto';
import { ValidateGenres } from '../genres/genres-validator';
import { MovieDto } from './dto/movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseInterceptors(ValidateGenres)
  getMovies(@Query() dto: MoviesFiltersDto) {
    const data = this.moviesService.get(dto);
    return { data };
  }

  @Post()
  @UseInterceptors(ValidateGenres)
  addMovie(@Body() movie: MovieDto) {
    const result = this.moviesService.addMovie(movie);

    if (result === ERR_MOVIE_EXISTS) {
      throw new ConflictException('Movie already exists');
    } else return result;
  }
}
