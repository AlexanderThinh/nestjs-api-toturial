import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from './db/db.module';
import { UserEntity } from './entity/entity.user';
import { BookmarkEntity } from './entity/entity.bookmark';

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
    AuthModule, 
    UserModule, 
    BookmarkModule, 
    DbModule]
})
export class AppModule {}
