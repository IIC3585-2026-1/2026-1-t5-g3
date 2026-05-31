import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

export interface UpsertBookData {
  externalApiId: string;
  title: string;
  authors: string[];
  thumbnailUrl?: string;
  description?: string;
  pageCount?: number;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findOrCreate(data: UpsertBookData): Promise<Book> {
    const existing = await this.booksRepository.findOne({
      where: { externalApiId: data.externalApiId },
    });

    if (existing) {
      if (!existing.pageCount && data.pageCount) {
        existing.pageCount = data.pageCount;
        return this.booksRepository.save(existing);
      }
      return existing;
    }

    const book = this.booksRepository.create({
      ...data,
      provider: 'google-books',
    });

    return this.booksRepository.save(book);
  }
}
