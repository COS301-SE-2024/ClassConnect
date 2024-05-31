import { Controller } from '@nestjs/common';
import { OrganisationService } from './organisation.service';

@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  // Add routes for organisation management
}
