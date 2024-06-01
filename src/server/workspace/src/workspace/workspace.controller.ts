import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.workspaceService.delete(id);
  }
}
