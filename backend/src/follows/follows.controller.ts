import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  follow(
    @Request() req: { user: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.followsService.follow(req.user.id, userId);
  }

  @Delete(':userId')
  unfollow(
    @Request() req: { user: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.followsService.unfollow(req.user.id, userId);
  }

  @Get('me/friends')
  getMyFriends(@Request() req: { user: { id: string } }) {
    return this.followsService.getFriends(req.user.id);
  }
}
