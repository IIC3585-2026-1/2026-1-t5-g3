import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Follow } from './entities/follow.entity';

export interface UserSummary {
  id: string;
  name: string;
}

export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isFriend: boolean;
}

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async follow(followerId: string, targetId: string): Promise<void> {
    if (followerId === targetId) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }

    const target = await this.usersRepository.findOne({
      where: { id: targetId },
    });
    if (!target) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existing = await this.followsRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: targetId },
      },
    });

    if (existing) {
      throw new ConflictException('Ya sigues a este usuario');
    }

    const follow = this.followsRepository.create({
      follower: { id: followerId },
      following: { id: targetId },
    });

    await this.followsRepository.save(follow);
  }

  async unfollow(followerId: string, targetId: string): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: targetId },
      },
    });

    if (!follow) {
      throw new NotFoundException('No sigues a este usuario');
    }

    await this.followsRepository.remove(follow);
  }

  async getFollowing(userId: string): Promise<UserSummary[]> {
    const follows = await this.followsRepository.find({
      where: { follower: { id: userId } },
      relations: { following: true },
      order: { createdAt: 'DESC' },
    });

    return follows.map((follow) => ({
      id: follow.following.id,
      name: follow.following.name,
    }));
  }

  async getFollowers(userId: string): Promise<UserSummary[]> {
    const follows = await this.followsRepository.find({
      where: { following: { id: userId } },
      relations: { follower: true },
      order: { createdAt: 'DESC' },
    });

    return follows.map((follow) => ({
      id: follow.follower.id,
      name: follow.follower.name,
    }));
  }

  async getFriends(userId: string): Promise<UserSummary[]> {
    const following = await this.getFollowing(userId);
    const followingIds = new Set(following.map((user) => user.id));

    const followers = await this.getFollowers(userId);
    return followers.filter((user) => followingIds.has(user.id));
  }

  async getFollowStatus(
    viewerId: string | null,
    profileId: string,
  ): Promise<FollowStatus | null> {
    if (!viewerId || viewerId === profileId) {
      return null;
    }

    const [isFollowing, isFollowedBy] = await Promise.all([
      this.followsRepository.exists({
        where: {
          follower: { id: viewerId },
          following: { id: profileId },
        },
      }),
      this.followsRepository.exists({
        where: {
          follower: { id: profileId },
          following: { id: viewerId },
        },
      }),
    ]);

    return {
      isFollowing,
      isFollowedBy,
      isFriend: isFollowing && isFollowedBy,
    };
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followsRepository.count({
      where: { follower: { id: userId } },
    });
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followsRepository.count({
      where: { following: { id: userId } },
    });
  }

  async getFriendsCount(userId: string): Promise<number> {
    const friends = await this.getFriends(userId);
    return friends.length;
  }
}
