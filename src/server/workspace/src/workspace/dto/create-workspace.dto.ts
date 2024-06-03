import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  organisation: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsUrl()
  @IsOptional()
  image?: string;
}
