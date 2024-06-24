//this will handle all the database querying

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Material } from '../schemas/material.schema';

import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const createdMaterial = new this.materialModel(createMaterialDto);

    return createdMaterial.save();
  }

  async findOne(id: string): Promise<Material> {
    return this.materialModel.findById(id).exec();
  }

  async findAllByWorkspaceId(workspaceId: string): Promise<Material[]> {
    return this.materialModel.find({ workspace_id: workspaceId }).exec();
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    return this.materialModel
      .findByIdAndUpdate(id, updateMaterialDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.materialModel.findByIdAndDelete(id).exec();
    return { message: 'Learning Material deleted successfully.' };
  }
}
