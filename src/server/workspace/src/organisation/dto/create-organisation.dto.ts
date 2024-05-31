import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsUrl()
  @IsOptional()
  image?: string;
}
