import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { TeamModule } from './team/team.module';
import { TeamMovesModule } from './team-moves/team-moves.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/administrator-db-api'),
    AccountModule,
    TeamModule,
    TeamMovesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
