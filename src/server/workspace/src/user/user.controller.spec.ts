import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findById: jest.fn(),
            findMany: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should call the createUser method of the service', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        surname: 'user',
        username: 'testuser',
        email: 'test@test.com',
        role: 'student',
        password: 'Test1234',
      };
      await controller.createUser(createUserDto);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getUser', () => {
    it('should call the findById method of the service', async () => {
      const id = 'test-id';
      await controller.getUser(id);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('getUsers', () => {
    it('should call the findMany method of the service', async () => {
      const filter = { username: 'testuser' };
      await controller.getUsers(filter);
      expect(service.findMany).toHaveBeenCalledWith(filter);
    });
  });

  describe('updateUser', () => {
    it('should call the updateUser method of the service', async () => {
      const id = 'test-id';
      const updateUserDto = { username: 'updateduser' };
      await controller.updateUser(id, updateUserDto);
      expect(service.updateUser).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should call the deleteUser method of the service', async () => {
      const id = 'test-id';
      await controller.deleteUser(id);
      expect(service.deleteUser).toHaveBeenCalledWith(id);
    });
  });
});
