import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


export type OrganisationDocument = Organisation & Document;

@Schema({ timestamps: true })
export class Organisation{

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    createdBy: string;

    @Prop({required: true})
    picture: string;


    @Prop({required: false})
    users: string[];

    @Prop({unique: true, required: true})
    createdAt: string;

    @Prop({required: true})
    updatedAt: string;
} 

export const OrganisationSchema=SchemaFactory.createForClass(Organisation);