import { Controller, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/Guards/JwtGuard';
import { User } from 'src/decorator';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  userInfo(@User() user: Request) {
    return user;
  }
}
