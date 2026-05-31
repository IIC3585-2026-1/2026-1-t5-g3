import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../books/books.module';
import { UserBooksService } from './user-books.service';
import { UserBooksController } from './user-books.controller';
import { UserBook } from './entities/user-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook]), BooksModule],
  controllers: [UserBooksController],
  providers: [UserBooksService],
  exports: [UserBooksService],
})
export class UserBooksModule {}
