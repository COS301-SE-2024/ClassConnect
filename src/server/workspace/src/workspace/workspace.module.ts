import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace, WorkspaceSchema } from '../schemas/workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
