import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from '../../follows/entities/follow.entity';
import { Recommendation } from '../../recommendations/entities/recommendation.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => UserBook, (userBook: UserBook): User => userBook.user)
  books!: UserBook[];

  @OneToMany(
    () => Recommendation,
    (recommendation: Recommendation): User => recommendation.fromUser,
  )
  recommendations!: Recommendation[];

  @OneToMany(() => Follow, (follow: Follow): User => follow.follower)
  following!: Follow[];

  @OneToMany(() => Follow, (follow: Follow): User => follow.following)
  followers!: Follow[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
