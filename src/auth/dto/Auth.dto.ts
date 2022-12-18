import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class IAuth {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
