import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateOrganisationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  image?: string;
}
