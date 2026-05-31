import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { UserBookStatus } from '../entities/user-book.entity';

export class UpdateUserBookStatusDto {
  @IsEnum(UserBookStatus)
  status!: UserBookStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  readingProgress?: number;
}
