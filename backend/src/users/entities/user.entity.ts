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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => UserBook, (userBook: UserBook): User => userBook.user)
  books!: UserBook[];

  @OneToMany(
    () => Recommendation,
    (recommendation: Recommendation): User => recommendation.fromUser,
  )
  sentRecommendations!: Recommendation[];

  @OneToMany(
    () => Recommendation,
    (recommendation: Recommendation): User => recommendation.toUser,
  )
  receivedRecommendations!: Recommendation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
