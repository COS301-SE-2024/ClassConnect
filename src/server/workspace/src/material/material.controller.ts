//this will handle all the http reqs and the responses

import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from '../schemas/material.schema';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.materialService.findOne(id);
  }

  //this returns all material based off a specific workspace
  @Get('workspace/:workspaceId')
  async findAllByWorkspaceId(
    @Param('workspaceId') workspaceId: string,
  ): Promise<Material[]> {
    return this.materialService.findAllByWorkspaceId(workspaceId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.materialService.delete(id);
  }
}
