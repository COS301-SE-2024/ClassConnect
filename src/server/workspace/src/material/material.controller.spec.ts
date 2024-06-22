import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [
        {
          provide: MaterialService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAllByWorkspaceId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MaterialController>(MaterialController);
    service = module.get<MaterialService>(MaterialService);
  });

  describe('create', () => {
    it('should call the create method of the service', async () => {
      const createMaterialDto: CreateMaterialDto = {
        type: true,
        workspace_id: 'workspace-id-1',
        lecturer_id: 'lecturer-id-1',
        title: 'Test Material',
        description: 'Test Description',
        file_path: '/path/to/file.pdf',
      };

      await controller.create(createMaterialDto);

      expect(service.create).toHaveBeenCalledWith(createMaterialDto);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service', async () => {
      const id = 'test-id';

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findAllByWorkspaceId', () => {
    it('should call the findAllByWorkspaceId method of the service', async () => {
      const workspaceId = 'workspace-id-1';

      await controller.findAllByWorkspaceId(workspaceId);

      expect(service.findAllByWorkspaceId).toHaveBeenCalledWith(workspaceId);
    });
  });

  describe('update', () => {
    it('should call the update method of the service', async () => {
      const id = 'test-id';
      const updateMaterialDto: UpdateMaterialDto = {
        title: 'Updated Material',
        description: 'Updated Description',
        file_path: '/path/to/updated-file.pdf',
      };

      await controller.update(id, updateMaterialDto);

      expect(service.update).toHaveBeenCalledWith(id, updateMaterialDto);
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
