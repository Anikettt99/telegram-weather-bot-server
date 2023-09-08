import { Module } from '@nestjs/common';
import { AdminController } from './controllers/AdminController';
import { AdminService } from './services/Admin';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './models/Admin';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
