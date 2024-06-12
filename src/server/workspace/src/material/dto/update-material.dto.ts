import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateMaterialDto {
  @IsString()
  @IsOptional()
  file_path?: string;

  @IsUrl()
  @IsOptional()
  title?: string;

  @IsUrl()
  @IsOptional()
  description?: string;
}