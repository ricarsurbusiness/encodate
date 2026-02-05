import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(240)
  @Type(() => Number) //transforma a string a numero
  duration: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
}
