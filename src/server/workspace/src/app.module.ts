import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';
import { UsersModule } from './users/users.modules';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/cassconnectdb?ssl=false'),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
