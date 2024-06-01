import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
