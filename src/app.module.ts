import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { DbModule } from './db/db.module';
import { BookmarkEntity } from './entity/entity.bookmark';
import { UserEntity } from './entity/entity.user';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'themilkyway',
      database: 'nestjs_api_tutorial',
      entities: [UserEntity, BookmarkEntity],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    UserModule, 
    BookmarkModule, 
    DbModule]
})
export class AppModule {}
