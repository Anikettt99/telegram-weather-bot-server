import { TelegramService } from '../services/Telegram';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

@Controller('/telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}
  @Get('/users')
  async getUsers() {
    const response = await this.telegramService.getAllUser();
    return response;
  }

  @Patch('/:userId')
  async updateUser(@Param('userId') userId, @Body() body) {
    await this.telegramService.updateUser({ userId, ...body });
    return 'Updated Sucessfully!';
  }
}
