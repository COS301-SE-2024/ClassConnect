import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;
  
    @IsOptional()
    @IsString()
    lastName?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    role?: string;
  
    @IsOptional()
    @IsString()
    image?: string;
  }