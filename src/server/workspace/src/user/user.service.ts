import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Utility } from '../utils/utility';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const username = Utility.generateUsername(
      createUserDto.role,
      createUserDto.email,
    );

    const hashedPassword = await Utility.hashPassword(createUserDto.password);

    const newUser = new this.userModel({
      ...createUserDto,
      username,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findMany(filter: Partial<CreateUserDto>): Promise<User[]> {
    const users = await this.userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    return users;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await Utility.hashPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'User deleted successfully.' };
  }
}
