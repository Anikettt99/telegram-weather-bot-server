import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user';
import * as mongoose from 'mongoose';
import axios from 'axios';

export class WeatherService {
  constructor(
    @InjectModel(User.name)
    private user: mongoose.Model<User>,
  ) {}
  async createWeatherSubscription(
    inputs: Record<string, any>,
  ): Promise<string> {
    const { from } = inputs;
    const { id, first_name, last_name, username } = from;
    try {
      const userExist = await this.user.findOne({ chatId: id });

      if (userExist) {
        if (userExist.city && !userExist.isSubscriptionActive) {
          return 'You have been blocked, Please contact admin!';
        }
        if (userExist.city) {
          return 'Already subscribed!';
        } else {
          return 'Please Enter Your City Name';
        }
      } else {
        await this.user.create({
          chatId: id,
          firstName: first_name,
          lastName: last_name,
          userName: username,
          isSubscriptionActive: false,
        });
      }
      return 'Please Enter Your City Name';
    } catch (error) {
      console.log('Error in creating Weather Subscription:', error);
      throw new Error('Internal Server Error');
    }
  }

  async updateWeatherSubscription(inputs: Record<string, any>) {
    const { from, text } = inputs;
    try {
      const user = await this.user.findOne({ chatId: from.id });
      if (user && user.city && !user.isSubscriptionActive) {
        return 'You have been blocked, Please contact admin!';
      }

      const weatherReport = await this.getWeatherReport(text);
      if (weatherReport.success == false) {
        return 'Please Check your city name! ';
      }

      if (user) {
        user.set({
          city: weatherReport.location.name,
          isSubscriptionActive: true,
        });
        await user.save();
      }

      return `City:${weatherReport.location.name} \n Temperature: ${weatherReport.current.temperature}°C \n Humidity: ${weatherReport.current.humidity}% \n WindSpeed: ${weatherReport.current.wind_speed}km/h \n Pressure: ${weatherReport.current.pressure}mbar`;
    } catch (error) {
      console.log('Error in updating Weather Subscription:', error);
      throw new Error('Internal Server Error');
    }
  }

  async getWeatherReport(city: string) {
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`,
      );
      return response.data;
    } catch (error) {
      console.log('Error in fetching weather report: ', error);
      return {
        success: false,
      };
    }
  }
}
