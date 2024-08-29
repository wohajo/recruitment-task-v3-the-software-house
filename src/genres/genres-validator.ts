import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GenresService } from '../genres/genres.service';

@Injectable()
export class GenresValidator implements NestInterceptor {
  constructor(private readonly genresService: GenresService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const genres = request.body.genres ?? request.query.genres;

    const validGenres = this.genresService.getGenres();

    if (!genres) return next.handle();

    if (
      genres.some((genre) => !validGenres.includes(genre)) ||
      !genres.length
    ) {
      throw new BadRequestException('Invalid genre');
    }

    return next.handle();
  }
}
