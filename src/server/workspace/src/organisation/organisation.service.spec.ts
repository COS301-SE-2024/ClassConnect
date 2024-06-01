import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { OrganisationService } from './organisation.service';
import { Organisation } from '../schemas/organisation.schema';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';

describe('OrganisationService', () => {
  let service: OrganisationService;
  let model: Model<Organisation>;

  const organisationMock = {
    _id: 'test-id',
    name: 'Test Organisation',
    createdBy: 'test-user-id',
  };

  const updateOrganisationDto: UpdateOrganisationDto = {
    name: 'Updated Organisation',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationService,
        {
          provide: getModelToken(Organisation.name),
          useValue: {
            new: jest.fn().mockResolvedValue(organisationMock),
            constructor: jest.fn().mockResolvedValue(organisationMock),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganisationService>(OrganisationService);
    model = module.get<Model<Organisation>>(getModelToken(Organisation.name));
  });

  describe('findOne', () => {
    it('should find an organisation by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(organisationMock),
      } as any);

      const result = await service.findOne('test-id');

      expect(result).toEqual(organisationMock);
    });
  });

  describe('update', () => {
    it('should update an organisation', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(organisationMock),
      } as any);

      const result = await service.update('test-id', updateOrganisationDto);

      expect(result).toEqual(organisationMock);
    });
  });

  describe('delete', () => {
    it('should delete an organisation', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.delete('test-id');

      expect(result).toEqual({ message: 'Organisation deleted successfully.' });
    });
  });
});
