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
  
  import { ScheduleService } from './schedule.service';
  import { CreateScheduleDto } from './dto/create-schedule.dto';
  import { UpdateScheduleDto } from './dto/update-schedule.dto';
  import { Schedule } from '../schemas/schedule.schema';
  
  @Controller('schedules')
  export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    
    @Post()
    async create(@Body() createScheduleDto: CreateScheduleDto) {
      return this.scheduleService.create(createScheduleDto);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.scheduleService.findOne(id);
    }

    @Get('workspace/:workspaceId')
    async findAllByWorkspaceId(@Param('workspaceId') workspaceId: string): Promise<Schedule[]> {
      return this.scheduleService.findAllByWorkspaceId(workspaceId);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateScheduleDto: UpdateScheduleDto,
    ) {
      return this.scheduleService.update(id, updateScheduleDto);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.scheduleService.delete(id);
    }
  }
  