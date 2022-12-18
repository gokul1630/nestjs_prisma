import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { IAuth } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signin(@Body() dto: IAuth) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: IAuth) {
    return this.authService.signup(dto);
  }
}
