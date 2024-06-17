import { IsDateString, IsNotEmpty, IsString} from  'class-validator';

export class UpdateScheduleDto{

    //@IsNotEmpty()
    @IsDateString()
    date?: string;


    //@isOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    topic?: string;
}