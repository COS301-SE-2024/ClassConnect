import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';


//this is the Schedule schema
@Schema({ timestamps: true })
export class Schedule extends Document{

    //this is the workspace  id
    @Prop({type: Types.ObjectId, ref: 'Workspace', required: true})
    workspace_id: Types.ObjectId;

    //this is the lecturer id
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    lecturer_id: Types.ObjectId;

    //this is the title of the lesson
    @Prop({required: true})
    topic: string;

    //this is the description of the lesson
    @Prop({required: false})
    description: string;

    //this is the date of the lesson
    @Prop({required: true})
    date: Date;

}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);