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
  