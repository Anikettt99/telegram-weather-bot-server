import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    isRequired: true,
  })
  firstName: string;

  @Prop({
    isRequired: true,
  })
  lastName: string;

  @Prop({
    isRequired: true,
  })
  userName: string;

  @Prop({
    isRequired: true,
  })
  chatId: string;

  @Prop({
    default: false,
  })
  isSubscriptionActive: boolean;

  @Prop({
    default: '',
  })
  city: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
