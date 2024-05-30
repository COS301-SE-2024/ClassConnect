// organisations.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/createOrganisation.dto';
//import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from '../schemas/Organisation.schema';
//  import { RolesGuard } from '../auth/roles.guard'; 
//  import { Roles } from '../auth/roles.decorator'; 

@Controller('organisations')
//@UseGuards(RolesGuard)
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  //this is the create endpoint
  @Post()
  //@Roles('administrator')
  async create(@Body() createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  //this displays all the organisations on postman
  async findAll(): Promise<Organisation[]>{
    return this.organisationsService.findAll();
  }
}