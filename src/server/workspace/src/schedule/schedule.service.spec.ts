import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { Schedule } from '../schemas/schedule.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let model: Model<Schedule>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: getModelToken(Schedule.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    model = module.get<Model<Schedule>>(getModelToken(Schedule.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //   describe('create', () => {
  //     it('should create a schedule', async () => {
  //       const createScheduleDto: CreateScheduleDto = {
  //         topic: 'Test Schedule', // Updated to 'topic'
  //         description: 'This is a test schedule',
  //         startTime: new Date('2024-06-24T10:00:00Z'),
  //         endTime: new Date('2024-06-24T12:00:00Z'),
  //         workspace_id: 'workspace-id-1', // Use string instead of ObjectId
  //       };

  //       const createdSchedule: Schedule = {
  //         _id: 'dummy-id', // Replace with a mock ID
  //         ...createScheduleDto,
  //       };

  //       jest.spyOn(model, 'new').mockReturnValue(createdSchedule);

  //       const result = await service.create(createScheduleDto);

  //       expect(result).toEqual(createdSchedule);
  //     });
  //   });

  describe('findOne', () => {
    it('should find a schedule by id', async () => {
      const scheduleId = 'dummy-id';

      const foundSchedule = {
        _id: scheduleId,
        topic: 'Found Schedule', // Updated to 'topic'
        description: 'This is a found schedule',
        date: '2024-06-24T10:00:00Z',
        workspace_id: 'workspace-id-1', // Use string instead of ObjectId
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundSchedule),
      } as unknown as Query<any, Schedule>);

      const result = await service.findOne(scheduleId);

      expect(model.findById).toHaveBeenCalledWith(scheduleId);
      expect(result).toEqual(foundSchedule);
    });
  });

  describe('findAllByWorkspaceId', () => {
    it('should call find method and return schedules', async () => {
      const workspaceId = 'dummy-workspace-id';
      const foundSchedules = [
        {
          _id: 'schedule-id-1',
          topic: 'Schedule 1',
          description: 'This is schedule 1',
          date: '2024-06-26T09:00:00Z',
          //endTime: new Date('2024-06-26T11:00:00Z'),
          workspace_id: workspaceId,
        },
        {
          _id: 'schedule-id-2',
          topic: 'Schedule 2',
          description: 'This is schedule 2',
          date: '2024-06-27T09:00:00Z',
          //endTime: new Date('2024-06-27T11:00:00Z'),
          workspace_id: workspaceId,
        },
      ];

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundSchedules),
      } as any);

      const result = await service.findAllByWorkspaceId(workspaceId);

      expect(model.find).toHaveBeenCalledWith({ workspace_id: workspaceId });
      expect(result).toEqual(foundSchedules);
    });
  });

  describe('update', () => {
    it('should call findByIdAndUpdate method and return the updated schedule', async () => {
      const id = 'dummy-id';
      const updateScheduleDto: UpdateScheduleDto = {
        topic: 'Updated Schedule',
        description: 'This is an updated schedule',
        date: '2024-06-28T10:00:00Z',
        //endTime: new Date('2024-06-28T12:00:00Z'),
        //workspace_id: 'workspace-id-1',
      };
      const updatedSchedule = {
        _id: id,
        ...updateScheduleDto,
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedSchedule),
      } as any);

      const result = await service.update(id, updateScheduleDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateScheduleDto,
        { new: true },
      );
      expect(result).toEqual(updatedSchedule);
    });
  });

  describe('delete', () => {
    it('should call findByIdAndDelete method and return a success message', async () => {
      const id = 'dummy-id';
      const deleteResponse = { message: 'Lesson deleted successfully.' };

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.delete(id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResponse);
    });
  });
});
