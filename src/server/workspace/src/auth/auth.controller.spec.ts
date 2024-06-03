import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { AuthController } from './auth.controller';

const mockAuthService = {
  signup: jest.fn(),
};

const mockLocalGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'userId', email: 'test@example.com' };
    return true;
  }),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'userId', email: 'test@example.com' };
    return true;
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        Reflector,
      ],
    })
      .overrideGuard(LocalGuard)
      .useValue(mockLocalGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
