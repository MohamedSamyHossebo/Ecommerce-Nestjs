import { Type } from 'class-transformer';
import { IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit = 20;
}
