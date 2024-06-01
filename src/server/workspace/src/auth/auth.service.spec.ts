import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

const mockJwtService = {
  sign: jest.fn(),
};

const mockUserService = {
  findByUsername: jest.fn(),
  createUser: jest.fn(),
};

const mockUser = (dto: Partial<CreateUserDto> & { _id: string }) => ({
  ...dto,
  _id: 'someUserId',
  password: 'hashed_password',
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should call UserService.createUser with the correct parameters', async () => {
      const user = mockUser({
        _id: 'someUserId',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
      });

      UserService.prototype.createUser = jest.fn().mockResolvedValue(user);
    });
  });
});
