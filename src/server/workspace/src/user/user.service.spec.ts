import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

const mockUserModel = {
  save: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockUser = (dto: Partial<CreateUserDto> & { _id: string }) => ({
  ...dto,
  save: jest.fn().mockResolvedValue({ ...dto }),
});

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const userId = 'someId';
      const user = mockUser({ _id: userId, email: 'test@example.com' });

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findById(userId);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistentId';

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testUser';
      const user = mockUser({ _id: 'someId', username });

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findByUsername(username);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const username = 'nonexistentUser';

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findByUsername(username)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMany', () => {
    it('should find users by filter', async () => {
      const filter = { email: 'test@example.com' };
      const users = [
        mockUser({ _id: 'id1', email: 'test@example.com' }),
        mockUser({ _id: 'id2', email: 'test@example.com' }),
      ];

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await service.findMany(filter);
      expect(result).toEqual(users);
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const userId = 'someId';
      const updateUserDto: Partial<CreateUserDto> = {
        email: 'new@example.com',
      };
      const updatedUser = mockUser({ _id: userId, ...updateUserDto });

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.updateUser(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistentId';
      const updateUserDto: Partial<CreateUserDto> = {
        email: 'new@example.com',
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = 'someId';
      const user = mockUser({ _id: userId });

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.deleteUser(userId);
      expect(result).toEqual({ message: 'User deleted successfully.' });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistentId';

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
