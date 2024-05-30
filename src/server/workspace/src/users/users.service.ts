// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/User.schema';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...userData, password: hashedPassword,  organizations: createUserDto.organizations || [],
      workspaces: createUserDto.workspaces || [],
      image: createUserDto.image || "" });
    return newUser.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
}
