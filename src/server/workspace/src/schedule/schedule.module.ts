//this will encapsulate the functionality and components

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Schedule, ScheduleSchema } from '../schemas/schedule.schema';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
