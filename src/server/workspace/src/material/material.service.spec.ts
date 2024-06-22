// material.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from './material.service';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from '../schemas/material.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';

describe('MaterialService', () => {
  let service: MaterialService;
  let model: Model<Material>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: getModelToken(Material.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
    model = module.get<Model<Material>>(getModelToken(Material.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('create', () => {
  //   it('should call the save method and return the created material', async () => {
  //     const createMaterialDto: CreateMaterialDto = {
  //       type: true,
  //       workspace_id: 'workspace-id-1',
  //       lecturer_id: 'lecturer-id-1',
  //       title: 'Test Material',
  //       description: 'Test Description',
  //       file_path: '/path/to/file.pdf',
  //     };

  //     const createdMaterial = new Material(createMaterialDto);
  //     const saveSpy = jest.spyOn(createdMaterial, 'save').mockResolvedValue(createdMaterial);

  //     jest.spyOn(model as any, 'new').mockReturnValue(createdMaterial);

  //     const result = await service.create(createMaterialDto);

  //     expect(model.prototype.save).toHaveBeenCalled();
  //     expect(result).toEqual(createdMaterial);
  //     saveSpy.mockRestore();
  //   });
  // });

  describe('findOne', () => {
    it('should call the findById method and return the material', async () => {
      const id = 'test-id';
      const foundMaterial = {
        _id: id,
        type: true,
        workspace_id: 'workspace-id-1',
        lecturer_id: 'lecturer-id-1',
        title: 'Test Material',
        description: 'Test Description',
        file_path: '/path/to/file.pdf',
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundMaterial),
      } as unknown as Query<any, Material>); // Cast as Query<any, Material> for TypeScript

      const result = await service.findOne(id);

      expect(model.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(foundMaterial);
    });
  });

  describe('findAllByWorkspaceId', () => {
    it('should call the find method and return the materials', async () => {
      const workspaceId = 'workspace-id-1';
      const foundMaterials = [
        {
          _id: 'test-id-1',
          type: true,
          workspace_id: workspaceId,
          lecturer_id: 'lecturer-id-1',
          title: 'Material 1',
          description: 'Description 1',
          file_path: '/path/to/file1.pdf',
        },
        {
          _id: 'test-id-2',
          type: false,
          workspace_id: workspaceId,
          lecturer_id: 'lecturer-id-2',
          title: 'Material 2',
          description: 'Description 2',
          file_path: '/path/to/file2.pdf',
        },
      ];

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundMaterials),
      } as unknown as Query<any[], Material>); // Cast as Query<any[], Material> for TypeScript

      const result = await service.findAllByWorkspaceId(workspaceId);

      expect(model.find).toHaveBeenCalledWith({ workspace_id: workspaceId });
      expect(result).toEqual(foundMaterials);
    });
  });

  describe('update', () => {
    it('should call the findByIdAndUpdate method and return the updated material', async () => {
      const id = 'test-id';
      const updateMaterialDto: UpdateMaterialDto = {
        title: 'Updated Material',
        description: 'Updated Description',
        file_path: '/path/to/updated-file.pdf',
      };

      const updatedMaterial = {
        _id: id,
        ...updateMaterialDto,
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedMaterial),
      } as unknown as Query<any, Material>); // Cast as Query<any, Material> for TypeScript

      const result = await service.update(id, updateMaterialDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateMaterialDto,
        { new: true },
      );
      expect(result).toEqual(updatedMaterial);
    });
  });

  describe('delete', () => {
    it('should call the findByIdAndDelete method and return a success message', async () => {
      const id = 'test-id';
      const deleteResponse = {
        message: 'Learning Material deleted successfully.',
      };

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleteResponse),
      } as unknown as Query<any, Material>); // Cast as Query<any, Material> for TypeScript

      const result = await service.delete(id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResponse);
    });
  });
});
