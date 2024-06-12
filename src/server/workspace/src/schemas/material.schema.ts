import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';


//this is the Material schema
@Schema({ timestamps: true })
export class Material extends Document{

     //this is the type 
    //either 3d model or pdf
    @Prop({required: true})
    type: boolean;

    //this is the workspace  id
    @Prop({type: Types.ObjectId, ref: 'Workspace', required: true})
    workspace_id: Types.ObjectId;

    //this is the lecturer id
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    lecturer_id: Types.ObjectId;

    //this is the title of the material
    @Prop({required: true})
    title: string;

    //this is the description of the material
    @Prop({required: true})
    description: string;

    //this is the filepath of the material
    @Prop({required: true})
    file_path: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);