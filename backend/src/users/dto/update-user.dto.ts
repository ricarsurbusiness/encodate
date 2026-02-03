import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;
}
