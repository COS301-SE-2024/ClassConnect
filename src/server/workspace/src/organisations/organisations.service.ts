// organisations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organisation, OrganisationDocument } from '../schemas/Organisation.schema';
import { CreateOrganisationDto } from './dto/createOrganisation.dto';
//import { UpdateOrganisationDto } from './dto/update-organisation.dto';

@Injectable()
export class OrganisationsService {
  constructor(@InjectModel(Organisation.name) private organisationModel: Model<OrganisationDocument>) {}

    //this creates the organisation and saves it to the db
    async create(createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
        const newOrganisation = new this.organisationModel(createOrganisationDto);
        return newOrganisation.save();
    }

    //this finds all the current Organisations
    async findAll(): Promise<Organisation[]> {
      return this.organisationModel.find().exec();
    }
}