import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Organisation } from '../schemas/organisation.schema';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
  ) {}

  async create(createOrganisationDto: any): Promise<Organisation> {
    const createdOrganisation = new this.organisationModel(
      createOrganisationDto,
    );

    return createdOrganisation.save();
  }

  async findOne(id: string): Promise<Organisation> {
    return this.organisationModel.findById(id).exec();
  }

  async update(id: string, updateOrganisationDto: any): Promise<Organisation> {
    return this.organisationModel
      .findByIdAndUpdate(id, updateOrganisationDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.organisationModel.findByIdAndDelete(id).exec();
    return { message: 'Organisation deleted successfully.' };
  }
}
