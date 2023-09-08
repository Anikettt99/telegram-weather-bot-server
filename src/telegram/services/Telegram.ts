import { Injectable } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { WeatherService } from './Weather';
import { InjectModel } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../models';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    private weatherService: WeatherService,
    @InjectModel(User.name)
    private user: mongoose.Model<User>,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_API_KEY, { polling: true });

    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        `Welcome to the Weather Update Bot! Use /subscribe to get daily weather updates or type your city to get weather report`,
      );
    });

    this.bot.onText(/\/subscribe/, async (msg) => {
      const chatId = msg.chat.id;
      const result = await this.weatherService.createWeatherSubscription(msg);
      this.bot.sendMessage(chatId, result);
    });

    this.bot.onText(/^(?!.*\/subscribe)[a-zA-Z0-9]+$/, async (msg) => {
      const chatId = msg.chat.id;
      const result = await this.weatherService.updateWeatherSubscription(msg);
      this.bot.sendMessage(chatId, result);
    });
  }

  async getAllUser() {
    try {
      const users = await this.user.find();
      return users;
    } catch (error) {
      console.log('Error is fetching users: ', error);
      throw new Error('Failed to fetch users');
    }
  }

  async updateUser(inputs: Record<string, any>) {
    try {
      const { userId, status, city } = inputs;
      await this.user.findByIdAndUpdate(
        { _id: userId },
        { isSubscriptionActive: status, city },
      );
    } catch (error) {
      console.log('Error is updating user: ', error);
      throw new Error('Failed to update user!');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    timeZone: 'Asia/Kolkata',
  })
  async sendWeatherUpdate() {
    const subscribedUsers = await this.user.find({
      isSubscriptionActive: true,
    });

    await Promise.all(
      subscribedUsers.map(async ({ userName, firstName, chatId, city }) => {
        if (city) {
          const weather = await this.weatherService.getWeatherReport(city);
          if (weather.success != false) {
            try {
              await this.bot.sendMessage(
                chatId,
                `City:${weather.location.name} \n Temperature: ${weather.current.temperature}°C \n Humidity: ${weather.current.humidity}% \n WindSpeed: ${weather.current.wind_speed}km/h \n Pressure: ${weather.current.pressure}mbar`,
              );

              console.log(
                `Weather update have been sent to the user: ${
                  userName || firstName
                }`,
              );
            } catch (error) {
              console.log(
                `Weather bot has been blocked by the user: ${
                  userName || firstName
                }`,
              );
            }
          }
        }
      }),
    );
  }
}
