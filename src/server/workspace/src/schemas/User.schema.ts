import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User{

    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({required: true})
    nickname: string;


    @Prop({unique: true, required: true})
    employeeID: number;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true})
    role: string;

    @Prop({required: true})
    password: string;
} 

export const UserSchema=SchemaFactory.createForClass(User);