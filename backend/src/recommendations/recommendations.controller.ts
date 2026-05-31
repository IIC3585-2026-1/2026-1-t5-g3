import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  findFriendsRecommendations(@Request() req: { user: { id: string } }) {
    return this.recommendationsService.findFriendsRecommendations(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: { user: { id: string } },
    @Body() createRecommendationDto: CreateRecommendationDto,
  ) {
    return this.recommendationsService.create(
      req.user.id,
      createRecommendationDto,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ) {
    return this.recommendationsService.update(
      req.user.id,
      id,
      updateRecommendationDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.recommendationsService.remove(req.user.id, id);
  }
}
