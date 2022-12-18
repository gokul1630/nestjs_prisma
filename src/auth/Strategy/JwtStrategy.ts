import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prismaService: PrismaService) {
    const secretOrKey = config.get('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }
  async validate({ userId }: { userId: number }) {
    const user = this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete (await user).hash;
    return user;
  }
}
