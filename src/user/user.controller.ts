import { Controller, Get, UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/Guards/JwtGuard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  userInfo(@Req() req: Request) {
    return req.user;
  }
}
