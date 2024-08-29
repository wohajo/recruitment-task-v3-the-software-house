import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MoviesFiltersDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Type(() => String)
  genres?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  duration?: number;
}
