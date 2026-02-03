import { IsEnum } from 'class-validator';
import { Role } from 'src/generated/enums';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}
