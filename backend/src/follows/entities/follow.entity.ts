import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user: User): Follow[] => user.following, {
    onDelete: 'CASCADE',
  })
  follower!: User;

  @ManyToOne(() => User, (user: User): Follow[] => user.followers, {
    onDelete: 'CASCADE',
  })
  following!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
