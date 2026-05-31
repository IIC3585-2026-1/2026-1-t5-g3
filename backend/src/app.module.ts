import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowsModule } from './follows/follows.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { UserBooksModule } from './user-books/user-books.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    UsersModule,

    FollowsModule,

    AuthModule,

    BooksModule,

    UserBooksModule,

    RecommendationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
