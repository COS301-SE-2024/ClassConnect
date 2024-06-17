import { IsDateString, IsNotEmpty, IsString} from  'class-validator';

export class CreateScheduleDto{

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