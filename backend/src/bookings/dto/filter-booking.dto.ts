import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BookingStatus } from 'src/generated/enums';

export class FilterBookingDto extends PaginationDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
