import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from './group/group.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/administrator-db-api'),
    GroupModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
