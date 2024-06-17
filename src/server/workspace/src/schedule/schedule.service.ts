//this will handle all the database querying 

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Schedule } from '../schemas/schedule.schema';

import { CreateScheduleDto } from './dto/create-schedule.dto';
//import { UpdateMaterialDto } from './dto/update-material.dto';
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const createdSchedule = new this.scheduleModel(createScheduleDto);

    return createdSchedule.save();
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleModel.findById(id).exec();
  }

  async findAllByWorkspaceId(workspaceId: string): Promise<Schedule[]> {
    return this.scheduleModel.find({ workspace_id: workspaceId }).exec();
  }

//   async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Material> {
//     return this.scheduleModel
//       .findByIdAndUpdate(id, updateMaterialDto, { new: true })
//       .exec();
//   }

//   async delete(id: string): Promise<{ message: string }> {
//     await this.scheduleModel.findByIdAndDelete(id).exec();
//     return { message: 'Learning Material deleted successfully.' };
//   }

}