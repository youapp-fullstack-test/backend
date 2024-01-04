import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Auth } from 'src/auth/entities/auth.entity';

@Schema({
  timestamps: true,
})

export class Profile extends Document {
  @Prop()
  name: string;

  @Prop()
  birthday: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  interests: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  user: Auth;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);