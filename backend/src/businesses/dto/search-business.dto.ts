import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.index';

export class SearchBusinessDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
