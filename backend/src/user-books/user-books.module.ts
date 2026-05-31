import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBooksService } from './user-books.service';
import { UserBooksController } from './user-books.controller';
import { UserBook } from './entities/user-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook])],
  controllers: [UserBooksController],
  providers: [UserBooksService],
})
export class UserBooksModule {}
