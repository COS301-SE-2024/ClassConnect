import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Workspace } from '../schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const createdWorkspace = new this.workspaceModel(createWorkspaceDto);

    return createdWorkspace.save();
  }

  async findOne(id: string): Promise<Workspace> {
    return this.workspaceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    return this.workspaceModel
      .findByIdAndUpdate(id, updateWorkspaceDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.workspaceModel.findByIdAndDelete(id).exec();

    return { message: 'Workspace deleted successfully.' };
  }
}
