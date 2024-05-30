import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateOrganisationDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsMongoId()
    createdBy: Types.ObjectId;
  
    @IsNotEmpty()
    @IsString()
    picture: string;
  
    @IsArray()
    @IsMongoId({ each: true })
    users: Types.ObjectId[];
  }