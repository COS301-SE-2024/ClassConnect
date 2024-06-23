import {
  Get,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from '../schemas/workspace.schema';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get('organisation/:organisationId')
  async findAllByOrganisationId(
    @Param('organisationId') organisationId: string,
  ): Promise<Workspace[]> {
    return this.workspaceService.findAllByOrganisationId(organisationId);
  }

  @Get()
  async findMany(@Query() query: Partial<CreateWorkspaceDto>) {
    return await this.workspaceService.findMany({ ...query });
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
