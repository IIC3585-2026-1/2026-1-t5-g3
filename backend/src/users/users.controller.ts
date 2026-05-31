import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { FollowsService } from '../follows/follows.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { UserBooksService } from '../user-books/user-books.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userBooksService: UserBooksService,
    private readonly followsService: FollowsService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Query('q') query: string) {
    return this.usersService.searchByName(query?.trim() ?? '');
  }

  @Get(':id/profile')
  @UseGuards(OptionalJwtAuthGuard)
  async getProfile(
    @Request() req: { user?: { id: string } | null },
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findByIdOrFail(id);
    const viewerId = req.user?.id ?? null;

    const [
      readThisYear,
      recommendations,
      friendsCount,
      followingCount,
      followersCount,
      friends,
      followStatus,
    ] = await Promise.all([
      this.userBooksService.getReadThisYearCount(id),
      this.recommendationsService.findByUser(id),
      this.followsService.getFriendsCount(id),
      this.followsService.getFollowingCount(id),
      this.followsService.getFollowersCount(id),
      this.followsService.getFriends(id),
      this.followsService.getFollowStatus(viewerId, id),
    ]);

    return {
      id: user.id,
      name: user.name,
      readThisYear,
      recommendations,
      friendsCount,
      followingCount,
      followersCount,
      friends,
      followStatus,
    };
  }

  @Get(':id/friends')
  getFriends(@Param('id') id: string) {
    return this.followsService.getFriends(id);
  }
}
