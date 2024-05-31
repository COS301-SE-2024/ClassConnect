import { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  signin(@Req() req: Request) {
    return req.user;
  }

  @Post('signup')
  @UseGuards(LocalGuard)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
