import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { BooksService } from '../books/books.service';
import { CreateUserBookDto } from './dto/create-user-book.dto';
import { UpdateUserBookProgressDto } from './dto/update-user-book-progress.dto';
import { UpdateUserBookStatusDto } from './dto/update-user-book-status.dto';
import { UserBook, UserBookStatus } from './entities/user-book.entity';

export interface UserBookResponse {
  id: string;
  status: UserBookStatus;
  readAt: Date | null;
  readingProgress: number;
  currentPage: number;
  book: {
    id: string;
    externalApiId: string;
    title: string;
    authors: string[];
    thumbnailUrl?: string;
    description?: string;
    pageCount?: number;
  };
}

export interface DashboardResponse {
  readThisYear: number;
  pending: number;
  reading: number;
  readThisYearBooks: UserBookResponse[];
  pendingBooks: UserBookResponse[];
  readingBooks: UserBookResponse[];
}

@Injectable()
export class UserBooksService {
  constructor(
    @InjectRepository(UserBook)
    private readonly userBooksRepository: Repository<UserBook>,
    private readonly booksService: BooksService,
  ) {}

  async findAllForUser(userId: string): Promise<UserBookResponse[]> {
    const userBooks = await this.userBooksRepository.find({
      where: { user: { id: userId } },
      relations: { book: true },
      order: { updatedAt: 'DESC' },
    });

    return userBooks.map((userBook) => this.toResponse(userBook));
  }

  async getDashboard(userId: string): Promise<DashboardResponse> {
    const userBooks = await this.userBooksRepository.find({
      where: { user: { id: userId } },
      relations: { book: true },
      order: { updatedAt: 'DESC' },
    });

    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const readThisYearBooks = userBooks.filter(
      (userBook) =>
        userBook.status === UserBookStatus.READ &&
        userBook.readAt &&
        userBook.readAt >= yearStart,
    );
    const pendingBooks = userBooks.filter(
      (userBook) => userBook.status === UserBookStatus.WANT_TO_READ,
    );
    const readingBooks = userBooks.filter(
      (userBook) => userBook.status === UserBookStatus.READING,
    );

    return {
      readThisYear: readThisYearBooks.length,
      pending: pendingBooks.length,
      reading: readingBooks.length,
      readThisYearBooks: readThisYearBooks.map((userBook) =>
        this.toResponse(userBook),
      ),
      pendingBooks: pendingBooks.map((userBook) => this.toResponse(userBook)),
      readingBooks: readingBooks.map((userBook) => this.toResponse(userBook)),
    };
  }

  async getReadThisYearCount(userId: string): Promise<number> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    return this.userBooksRepository.count({
      where: {
        user: { id: userId },
        status: UserBookStatus.READ,
        readAt: MoreThanOrEqual(yearStart),
      },
    });
  }

  async addBook(
    userId: string,
    createUserBookDto: CreateUserBookDto,
  ): Promise<UserBookResponse> {
    const book = await this.booksService.findOrCreate({
      externalApiId: createUserBookDto.externalApiId,
      title: createUserBookDto.title,
      authors: createUserBookDto.authors,
      thumbnailUrl: createUserBookDto.thumbnail,
      description: createUserBookDto.description,
      pageCount: createUserBookDto.pageCount,
    });

    const existing = await this.userBooksRepository.findOne({
      where: { user: { id: userId }, book: { id: book.id } },
      relations: { book: true },
    });

    if (existing) {
      throw new ConflictException('Este libro ya está en tu biblioteca');
    }

    const userBook = this.userBooksRepository.create({
      user: { id: userId },
      book,
      status: createUserBookDto.status,
      readAt:
        createUserBookDto.status === UserBookStatus.READ ? new Date() : null,
      readingProgress:
        createUserBookDto.status === UserBookStatus.READ ? 100 : 0,
      currentPage:
        createUserBookDto.status === UserBookStatus.READ
          ? (book.pageCount ?? 0)
          : 0,
    });

    const saved = await this.userBooksRepository.save(userBook);
    saved.book = book;
    return this.toResponse(saved);
  }

  async updateStatus(
    userId: string,
    userBookId: string,
    updateDto: UpdateUserBookStatusDto,
  ): Promise<UserBookResponse> {
    const userBook = await this.findUserBookOrFail(userId, userBookId);
    this.applyStatus(userBook, updateDto.status, updateDto.readingProgress);

    const saved = await this.userBooksRepository.save(userBook);
    return this.toResponse(saved);
  }

  async updateProgress(
    userId: string,
    userBookId: string,
    updateDto: UpdateUserBookProgressDto,
  ): Promise<UserBookResponse> {
    const userBook = await this.findUserBookOrFail(userId, userBookId);

    if (!userBook.book.pageCount || userBook.book.pageCount <= 0) {
      throw new BadRequestException(
        'Este libro no tiene total de páginas registrado',
      );
    }

    this.applyFromCurrentPage(userBook, updateDto.currentPage);

    const saved = await this.userBooksRepository.save(userBook);
    return this.toResponse(saved);
  }

  async remove(userId: string, userBookId: string): Promise<void> {
    const userBook = await this.findUserBookOrFail(userId, userBookId);
    await this.userBooksRepository.remove(userBook);
  }

  private applyStatus(
    userBook: UserBook,
    status: UserBookStatus,
    progress?: number,
  ): void {
    if (status === UserBookStatus.READ) {
      userBook.status = UserBookStatus.READ;
      userBook.readAt = new Date();
      userBook.readingProgress = 100;
      userBook.currentPage = userBook.book.pageCount ?? userBook.currentPage;
      return;
    }

    if (status === UserBookStatus.READING) {
      userBook.status = UserBookStatus.READING;
      userBook.readAt = null;
      userBook.readingProgress = progress ?? 0;
      userBook.currentPage = userBook.book.pageCount
        ? Math.round(((progress ?? 0) / 100) * userBook.book.pageCount)
        : 0;
      return;
    }

    userBook.status = UserBookStatus.WANT_TO_READ;
    userBook.readAt = null;
    userBook.readingProgress = 0;
    userBook.currentPage = 0;
  }

  private applyFromCurrentPage(userBook: UserBook, currentPage: number): void {
    const pageCount = userBook.book.pageCount ?? 0;
    const clampedPage = Math.min(Math.max(0, currentPage), pageCount);
    const progress = Math.round((clampedPage / pageCount) * 100);

    userBook.currentPage = clampedPage;
    userBook.readingProgress = progress;

    if (progress >= 100) {
      userBook.status = UserBookStatus.READ;
      userBook.readAt = new Date();
      userBook.readingProgress = 100;
      userBook.currentPage = pageCount;
      return;
    }

    userBook.status = UserBookStatus.READING;
    userBook.readAt = null;
  }

  private async findUserBookOrFail(
    userId: string,
    userBookId: string,
  ): Promise<UserBook> {
    const userBook = await this.userBooksRepository.findOne({
      where: { id: userBookId, user: { id: userId } },
      relations: { book: true },
    });

    if (!userBook) {
      throw new NotFoundException('Libro no encontrado');
    }

    return userBook;
  }

  private toResponse(userBook: UserBook): UserBookResponse {
    return {
      id: userBook.id,
      status: userBook.status,
      readAt: userBook.readAt ?? null,
      readingProgress: userBook.readingProgress,
      currentPage: userBook.currentPage,
      book: {
        id: userBook.book.id,
        externalApiId: userBook.book.externalApiId,
        title: userBook.book.title,
        authors: userBook.book.authors,
        thumbnailUrl: userBook.book.thumbnailUrl,
        description: userBook.book.description,
        pageCount: userBook.book.pageCount,
      },
    };
  }
}
