import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let service: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    service = module.get<WorkspaceService>(WorkspaceService);
  });

  describe('create', () => {
    it('should call the create method of the service', async () => {
      const createWorkspaceDto: CreateWorkspaceDto = {
        name: 'Test Workspace',
        createdBy: 'test-user-id',
        organisation: 'test-organisation-id',
      };

      await controller.create(createWorkspaceDto);

      expect(service.create).toHaveBeenCalledWith(createWorkspaceDto);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service', async () => {
      const id = 'test-id';

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findMany', () => {
    it('should call the findMany method of the service with empty query', async () => {
      const query = {};
      await controller.findMany(query);

      expect(service.findMany).toHaveBeenCalledWith(query);
    });

    it('should call the findMany method of the service with specific name query', async () => {
      const query = { name: 'Specific Workspace' };
      await controller.findMany(query);

      expect(service.findMany).toHaveBeenCalledWith(query);
    });

    it('should call the findMany method of the service with multiple query parameters', async () => {
      const query = {
        name: 'Specific Workspace',
        createdBy: 'specific-user-id',
      };
      await controller.findMany(query);

      expect(service.findMany).toHaveBeenCalledWith(query);
    });
  });

  describe('update', () => {
    it('should call the update method of the service', async () => {
      const id = 'test-id';
      const updateWorkspaceDto: UpdateWorkspaceDto = {
        name: 'Updated Workspace',
        // Add other properties as needed
      };

      await controller.update(id, updateWorkspaceDto);

      expect(service.update).toHaveBeenCalledWith(id, updateWorkspaceDto);
    });
  });

  describe('delete', () => {
    it('should call the delete method of the service', async () => {
      const id = 'test-id';

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
