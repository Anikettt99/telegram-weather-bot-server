import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Admin {
  @Prop({
    isRequired: true,
  })
  name: string;

  @Prop({
    isRequired: true,
  })
  email: string;

  @Prop()
  image: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
