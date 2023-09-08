import { Module } from '@nestjs/common';
import { TelegramService } from './services/Telegram';
import { WeatherService } from './services/Weather';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramController } from './controllers/TelegramController';
import { UserSchema } from './models';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [TelegramController],
  providers: [TelegramService, WeatherService],
})
export class TelegramModule {}
