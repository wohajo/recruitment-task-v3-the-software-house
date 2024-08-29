import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export interface MovieEntity {
  id: number;
  title: string;
  year: string;
  runtime: string;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
}

export class MovieDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(255)
  title!: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsDefined()
  year!: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsDefined()
  runtime!: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsDefined()
  @IsArray()
  genres!: string[];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  director!: string;

  @IsString()
  @IsOptional()
  actors?: string;

  @IsString()
  @IsOptional()
  plot?: string;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;
}
