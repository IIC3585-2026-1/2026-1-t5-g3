import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FollowsService } from '../follows/follows.service';
import { UserBook } from '../user-books/entities/user-book.entity';
import { Recommendation } from './entities/recommendation.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Recommendation),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserBook),
          useValue: {},
        },
        {
          provide: FollowsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(
      RecommendationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
