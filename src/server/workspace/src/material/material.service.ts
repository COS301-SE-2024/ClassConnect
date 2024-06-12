//this will handle all the database querying 

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Material } from '../schemas/material.schema';
@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
  ) {}

  async create(createMaterialDto: any): Promise<Material> {
    const createdMaterial = new this.materialModel(
      createMaterialDto,
    );

    return createdMaterial.save();
  }
}