import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recommendation } from '../../recommendations/entities/recommendation.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  externalApiId!: string;

  @Column()
  title!: string;

  @Column('text', { array: true, default: [] })
  authors!: string[];

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  publishedDate?: string;

  @Column({ type: 'int', nullable: true })
  pageCount?: number;

  @Column({ default: 'google-books' })
  provider!: string;

  @OneToMany(() => UserBook, (userBook: UserBook): Book => userBook.book)
  userBooks!: UserBook[];

  @OneToMany(
    () => Recommendation,
    (recommendation: Recommendation): Book => recommendation.book,
  )
  recommendations!: Recommendation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
