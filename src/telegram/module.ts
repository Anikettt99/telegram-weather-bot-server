import { Module } from '@nestjs/common';
import { TelegramService } from './services/Telegram';
import { WeatherService } from './services/Weather';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user';
import { TelegramController } from './controllers/TelegramController';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [TelegramController],
  providers: [TelegramService, WeatherService],
})
export class TelegramModule {}
