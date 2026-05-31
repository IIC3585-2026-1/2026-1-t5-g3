import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from '../books/books.service';
import { UserBooksService } from './user-books.service';
import { UserBook } from './entities/user-book.entity';

describe('UserBooksService', () => {
  let service: UserBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBooksService,
        {
          provide: getRepositoryToken(UserBook),
          useValue: {},
        },
        {
          provide: BooksService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserBooksService>(UserBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
