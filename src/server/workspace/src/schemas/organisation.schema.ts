import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Organisation extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workspace' }] })
  workspaces: Types.ObjectId[];
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
