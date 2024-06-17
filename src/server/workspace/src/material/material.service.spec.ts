// material.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MaterialService } from './material.service';
import { Material } from '../schemas/material.schema';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

describe('MaterialService', () => {
  let service: MaterialService;
  let model: Model<Material>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: getModelToken(Material.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
    model = module.get<Model<Material>>(getModelToken(Material.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new material', async () => {
      const createDto: CreateMaterialDto = {
        type: true,
        workspace_id: 'workspace-id',
        lecturer_id: 'lecturer-id',
        title: 'Test Material',
        description: 'Test Description',
        file_path: '/path/to/file.pdf',
      };

      const createdMaterial: Material = {
        _id: 'test-id',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(model.prototype, 'save').mockResolvedValue(createdMaterial);

      const result = await service.create(createDto);

      expect(result).toEqual(createdMaterial);
      expect(model.prototype.save).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should find a material by ID', async () => {
      const materialId = 'test-id';
      const foundMaterial: Material = {
        _id: materialId,
        type: true,
        workspace_id: 'workspace-id',
        lecturer_id: 'lecturer-id',
        title: 'Test Material',
        description: 'Test Description',
        file_path: '/path/to/file.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(model, 'findById').mockResolvedValue(foundMaterial);

      const result = await service.findOne(materialId);

      expect(result).toEqual(foundMaterial);
      expect(model.findById).toHaveBeenCalledWith(materialId);
    });
  });

  describe('findAllByWorkspaceId', () => {
    it('should find all materials by workspace ID', async () => {
      const workspaceId = 'workspace-id';
      const foundMaterials: Material[] = [
        {
          _id: 'material-1',
          type: true,
          workspace_id: workspaceId,
          lecturer_id: 'lecturer-id',
          title: 'Material 1',
          description: 'Description 1',
          file_path: '/path/to/file1.pdf',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: 'material-2',
          type: false,
          workspace_id: workspaceId,
          lecturer_id: 'lecturer-id',
          title: 'Material 2',
          description: 'Description 2',
          file_path: '/path/to/file2.pdf',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(model, 'find').mockResolvedValue(foundMaterials);

      const result = await service.findAllByWorkspaceId(workspaceId);

      expect(result).toEqual(foundMaterials);
      expect(model.find).toHaveBeenCalledWith({ workspace_id: workspaceId });
    });
  });

  describe('update', () => {
    it('should update a material by ID', async () => {
      const materialId = 'test-id';
      const updateDto: UpdateMaterialDto = {
        type: false,
        title: 'Updated Material',
        description: 'Updated Description',
        file_path: '/path/to/updated-file.pdf',
      };

      const updatedMaterial: Material = {
        _id: materialId,
       
        title: 'Updated Material',
        ...updateDto
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedMaterial);

      const result = await service.update(materialId, updateDto);

      expect(result).toEqual(updatedMaterial);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(materialId, updateDto, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete a material by ID', async () => {
      const materialId = 'test-id';

      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue({});

      const result = await service.delete(materialId);

      expect(result).toEqual({ message: 'Material deleted successfully.' });
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(materialId);
    });
  });
});
