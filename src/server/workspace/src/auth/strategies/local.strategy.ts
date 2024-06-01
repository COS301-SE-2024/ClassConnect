import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(username: string, password: string) {
    console.log('Inside LocalStrategy');
    const user = this.authService.validateUser({ username, password });

    if (!user) throw new UnauthorizedException();
    
    return user;
  }
}
