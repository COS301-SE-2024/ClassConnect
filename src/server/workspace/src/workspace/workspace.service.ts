import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from './schemas/workspace.schema';

@Injectable()
export class WorkspaceService {
  constructor(@InjectModel(Workspace.name) private workspaceModel: Model<Workspace>) {}

  // Add methods for workspace management
}
