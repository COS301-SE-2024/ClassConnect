//this will encapsulate the functionality and components

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Material,
  MaterialSchema,
} from '../schemas/material.schema';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  providers: [MaterialService],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}