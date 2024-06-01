import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';

describe('OrganisationController', () => {
  let controller: OrganisationController;
  let service: OrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganisationController],
      providers: [
        {
          provide: OrganisationService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganisationController>(OrganisationController);
    service = module.get<OrganisationService>(OrganisationService);
  });

  describe('create', () => {
    it('should call the create method of the service', async () => {
      const createOrganisationDto: CreateOrganisationDto = {
        name: 'Test Organisation',
        createdBy: 'test-user-id',
      };

      await controller.create(createOrganisationDto);

      expect(service.create).toHaveBeenCalledWith(createOrganisationDto);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service', async () => {
      const id = 'test-id';

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call the update method of the service', async () => {
      const id = 'test-id';
      const updateOrganisationDto: UpdateOrganisationDto = {
        name: 'Updated Organisation',
      };

      await controller.update(id, updateOrganisationDto);

      expect(service.update).toHaveBeenCalledWith(id, updateOrganisationDto);
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
