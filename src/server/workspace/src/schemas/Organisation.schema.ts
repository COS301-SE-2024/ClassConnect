import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";
import MongooseSchema from "mongoose";


export type OrganisationDocument = Organisation & Document;

@Schema({ timestamps: true })
export class Organisation{

    @Prop({required: true})
    name: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy: MongooseSchema.Types.ObjectId;

    @Prop({required: true})
    picture: string;


    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default:[]  })
    users: MongooseSchema.Types.ObjectId[];

    // @Prop({unique: true, required: true})
    // createdAt: string;

    // @Prop({required: true})
    // updatedAt: string;
} 

export const OrganisationSchema=SchemaFactory.createForClass(Organisation);

OrganisationSchema.pre