import { IsInt, Min } from 'class-validator';

export class UpdateUserBookProgressDto {
  @IsInt()
  @Min(0)
  currentPage!: number;
}
