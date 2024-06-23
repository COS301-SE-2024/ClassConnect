// schedule.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
//import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
//import { Schedule } from '../schemas/schedule.schema';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: {
            //create: jest.fn(),
            findOne: jest.fn(),
            findAllByWorkspaceId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

//   describe('create', () => {
//     it('should create a new schedule', async () => {
//       const createDto: CreateScheduleDto = {
//         date: '2024-06-24T10:00:00Z',
//         workspace_id: 'workspace-id-1',
//         lecturer_id: 'lecturer-id-1',
//         description: 'Sample description',
//         topic: 'Sample topic',
//       };

//       const createdSchedule: Schedule = {
//         _id: '6037bce2df95b73e28bc7227',
//         ...createDto,
//       };

//       jest.spyOn(scheduleService, 'create').mockResolvedValue(createdSchedule);

//       const result = await controller.create(createDto);

//       expect(result).toEqual(createdSchedule);
//     });
//   });

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
    const updateScheduleDto: UpdateScheduleDto = {
      topic: 'Updated Material',
      description: 'Updated Description',
      date: '/path/to/updated-file.pdf',
    };

    await controller.update(id, updateScheduleDto);

    expect(service.update).toHaveBeenCalledWith(id, updateScheduleDto);
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
