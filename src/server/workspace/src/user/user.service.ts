import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const username = this.generateUsername(
      createUserDto.role,
      createUserDto.email,
    );

    const hashedPassword = await this.hashPassword(createUserDto.password);

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

  async updateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
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

  private generateUsername(role: string, email: string): string {
    const rolePrefix = this.getRolePrefix(role);
    const year = new Date().getFullYear().toString().slice(-2);
    const emailHash = this.hashEmail(email).slice(0, 7);
    return `${rolePrefix}${year}${emailHash}`;
  }

  private getRolePrefix(role: string): string {
    switch (role) {
      case 'admin':
        return 'a';
      case 'lecturer':
        return 'e';
      case 'student':
        return 's';
      default:
        throw new Error('Invalid role');
    }
  }

  private hashEmail(email: string): string {
    const emailHash = crypto.createHash('sha256').update(email).digest('hex');
    const numericHash = emailHash.replace(/\D/g, '');
    return numericHash;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
