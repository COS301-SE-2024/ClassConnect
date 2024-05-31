// organisations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organisation, OrganisationDocument } from '../schemas/organisation.schema';
import { CreateOrganisationDto } from './dto/createOrganisation.dto';
import { UpdateOrganisationDto } from './dto/updateOrganisation.dto';
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

    //this finds a specififc organisation based on name
    async findOne(id: string): Promise<Organisation | undefined> {
      return this.organisationModel.findById(id).exec();
    }

    //this is the update Organisation
    async updateOrganisation(id: string, updateOrganisationDto: UpdateOrganisationDto): Promise<Organisation> {
      const updatedOrganisation = await this.organisationModel.findByIdAndUpdate(id, updateOrganisationDto, { new: true }).exec();
      if (!updatedOrganisation) {
        console.log("Failed to update Organisation");
      }
      return updatedOrganisation;
    }
}