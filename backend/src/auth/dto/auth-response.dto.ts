import { Role } from 'src/generated/enums';

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: Role;
  };
}
