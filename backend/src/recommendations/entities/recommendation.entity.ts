import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';

export enum RecommendationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('recommendations')
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
    (user: User): Recommendation[] => user.sentRecommendations,
    {
      onDelete: 'CASCADE',
    },
  )
  fromUser!: User;

  @ManyToOne(
    () => User,
    (user: User): Recommendation[] => user.receivedRecommendations,
    {
      onDelete: 'CASCADE',
    },
  )
  toUser!: User;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.PENDING,
  })
  status!: RecommendationStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
