import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  workspace_id: string;

  //this is the lecturer id
  @IsNotEmpty()
  @IsString()
  lecturer_id: string;

  //@isOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  topic: string;
}
