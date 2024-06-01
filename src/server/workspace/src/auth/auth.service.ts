import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { SignInDto } from './dto/signin.dto';
import { User } from '../schemas/user.schema';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser({ username, password }: SignInDto): Promise<string> {
    const findUser = await this.userService.findByUsername(username);

    if (findUser && (await bcrypt.compare(password, findUser.password))) {
      const user = {
        sub: findUser._id,
        role: findUser.role,
        username: findUser.username,
      };
      return this.jwtService.sign(user);
    } else {
      return null;
    }
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
