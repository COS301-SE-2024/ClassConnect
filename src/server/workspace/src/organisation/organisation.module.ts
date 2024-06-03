import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Organisation,
  OrganisationSchema,
} from '../schemas/organisation.schema';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organisation.name, schema: OrganisationSchema },
    ]),
  ],
  providers: [OrganisationService],
  controllers: [OrganisationController],
  exports: [OrganisationService],
})
export class OrganisationModule {}
