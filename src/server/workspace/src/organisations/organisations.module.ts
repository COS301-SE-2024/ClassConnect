import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organisation, OrganisationSchema } from '../schemas/Organisation.schema';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Organisation.name, schema: OrganisationSchema }])],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}