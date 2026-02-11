import { IsEnum } from 'class-validator';
import { BookingStatus } from 'src/generated/enums';

export class ChangeStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
