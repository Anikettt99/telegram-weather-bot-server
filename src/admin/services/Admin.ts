import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Admin } from '../models';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private admin: mongoose.Model<Admin>,
  ) {}

  async login(inputs: Record<string, any>) {
    const { email, name, image } = inputs;
    const adminExist = await this.admin.findOne({ email });

    if (!adminExist) {
      const admin = await this.admin.create({ email, name, image });
      return admin;
    }

    return adminExist;
  }
}
