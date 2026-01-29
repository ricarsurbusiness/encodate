import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { Role } from 'src/generated/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  role: Role;
}
