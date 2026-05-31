import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FollowsService } from '../follows/follows.service';
import { UserBook } from '../user-books/entities/user-book.entity';
import { Recommendation } from './entities/recommendation.entity';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
