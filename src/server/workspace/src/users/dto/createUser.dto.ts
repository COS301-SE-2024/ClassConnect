// create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  //@IsUUID()
  employeeID: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsStrongPassword()
  password: string;

  organizations?: string[];
  workspaces?: string[];
  image?: string;
}
