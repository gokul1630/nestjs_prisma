import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { IAuth } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: IAuth) {
    const hashedPassword = await hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });
      return this.signToken(user.email, user.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already Taken');
        }
      }
    }
  }

  async signin(dto: IAuth) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }
    const passwordMatch = await verify(user.hash, dto.password);
    if (!passwordMatch) {
      throw new ForbiddenException('Invalid Password');
    }
    return this.signToken(user.email, user.id);
  }

  async signToken(
    email: string,
    userId: number,
  ): Promise<{ access_token: string }> {
    const payload = {
      userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '50m',
      secret,
    });

    return {
      access_token,
    };
  }
}
