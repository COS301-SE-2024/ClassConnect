import { IsNotEmpty, IsString } from 'class-validator';

//this class just encapsulates data and does validation
export class CreateMaterialDto {
  //this is the type
  //either 3d model orpdf
  @IsNotEmpty()
  //@isBoolean(true)
  type: boolean;

  //this is the workspace  id
  @IsNotEmpty()
  @IsString()
  workspace_id: string;

  //this is the lecturer id
  @IsNotEmpty()
  @IsString()
  lecturer_id: string;

  //this is the title of the material
  @IsNotEmpty()
  @IsString()
  title: string;

  //this is the description of the material
  @IsNotEmpty()
  @IsString()
  description: string;

  //this is the filepath of the material
  @IsNotEmpty()
  @IsString()
  file_path: string;
}
