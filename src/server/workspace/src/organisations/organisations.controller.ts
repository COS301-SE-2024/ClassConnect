// organisations.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/createOrganisation.dto';
import { UpdateOrganisationDto } from './dto/updateOrganisation.dto';
import { Organisation } from '../schemas/organisation.schema';
//  import { RolesGuard } from '../auth/roles.guard'; 
//  import { Roles } from '../auth/roles.decorator'; 

@Controller('organisations')
//@UseGuards(RolesGuard)
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  //this is the create request
  @Post()
  //@Roles('administrator')
  async create(@Body() createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  //this is the findAll req
  async findAll(): Promise<Organisation[]>{
    return this.organisationsService.findAll();
  }

  //this is the findOne request
  @Get()
  async findOne(@Param('id') id: string): Promise<Organisation> {
    return this.organisationsService.findById(id);
  }

  //this is the updateOrg request.. THis is a Put req that takes in the parameter as the ID
  @Put(':id')
    async updateOrganisation(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
        const updatedOrganisation = await this.organisationsService.updateOrganisation(id, updateOrganisationDto);
        return updatedOrganisation;
    }

}