import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';

export enum UserBookStatus {
  READ = 'READ',
  WANT_TO_READ = 'WANT_TO_READ',
  READING = 'READING',
}

@Entity('user_books')
@Unique(['user', 'book'])
export class UserBook {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user: User): UserBook[] => user.books, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Book, (book: Book): UserBook[] => book.userBooks, {
    onDelete: 'CASCADE',
  })
  book!: Book;

  @Column({
    type: 'enum',
    enum: UserBookStatus,
  })
  status!: UserBookStatus;

  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date | null;

  @Column({ type: 'int', default: 0 })
  readingProgress!: number;

  @Column({ type: 'int', default: 0 })
  currentPage!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
