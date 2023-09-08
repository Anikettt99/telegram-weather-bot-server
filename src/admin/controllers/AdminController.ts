import { Controller, Post, Body } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AdminService } from '../services/Admin';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET_KEY,
);

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post('/login')
  async login(@Body('token') token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const response = await this.adminService.login({
      email: payload.email,
      name: payload.name,
      image: payload.picture,
    });

    return response;
  }
}
