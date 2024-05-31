import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { OrganisationModule } from './organisation/organisation.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cc'),
    UserModule,
    OrganisationModule,
    WorkspaceModule,
  ],
})
export class AppModule {}
