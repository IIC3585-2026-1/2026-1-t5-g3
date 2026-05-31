import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { UserBookStatus } from '../entities/user-book.entity';

export class CreateUserBookDto {
  @IsString()
  externalApiId!: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsArray()
  @IsString({ each: true })
  authors!: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageCount?: number;

  @IsEnum(UserBookStatus)
  status!: UserBookStatus;
}
