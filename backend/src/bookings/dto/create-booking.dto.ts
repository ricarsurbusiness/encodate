import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}
