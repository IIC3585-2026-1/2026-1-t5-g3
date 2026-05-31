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

@Entity('recommendations')
@Unique(['fromUser', 'book'])
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => Book,
    (book: Book): Recommendation[] => book.recommendations,
    {
      onDelete: 'CASCADE',
    },
  )
  book!: Book;

  @ManyToOne(
    () => User,
    (user: User): Recommendation[] => user.recommendations,
    {
      onDelete: 'CASCADE',
    },
  )
  fromUser!: User;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
