import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';
import { UsersModule } from './users/users.modules';
import { AuthModule } from './auth/auth.module';
import { OrganisationsModule } from './organisations/organisations.module'
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './auth/roles.guard';


@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/cassconnectdb?ssl=false'),
    UsersModule,
    AuthModule,
    OrganisationsModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
