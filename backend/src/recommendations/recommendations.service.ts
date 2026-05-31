import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FollowsService } from '../follows/follows.service';
import { UserBook, UserBookStatus } from '../user-books/entities/user-book.entity';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Recommendation } from './entities/recommendation.entity';

export interface RecommendationResponse {
  id: string;
  rating: number;
  message?: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
  book: {
    id: string;
    externalApiId: string;
    title: string;
    authors: string[];
    thumbnailUrl?: string;
    description?: string;
    pageCount?: number;
  };
}

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationsRepository: Repository<Recommendation>,
    @InjectRepository(UserBook)
    private readonly userBooksRepository: Repository<UserBook>,
    private readonly followsService: FollowsService,
  ) {}

  async create(
    userId: string,
    createDto: CreateRecommendationDto,
  ): Promise<RecommendationResponse> {
    const userBook = await this.findEligibleUserBook(
      userId,
      createDto.userBookId,
    );

    const existing = await this.recommendationsRepository.findOne({
      where: {
        fromUser: { id: userId },
        book: { id: userBook.book.id },
      },
    });

    if (existing) {
      throw new ConflictException('Ya recomendaste este libro en tu perfil');
    }

    const recommendation = this.recommendationsRepository.create({
      fromUser: { id: userId },
      book: userBook.book,
      rating: createDto.rating,
      message: createDto.message,
    });

    const saved = await this.recommendationsRepository.save(recommendation);
    saved.fromUser = { id: userId, name: '' } as Recommendation['fromUser'];
    saved.book = userBook.book;

    const withRelations = await this.recommendationsRepository.findOne({
      where: { id: saved.id },
      relations: { fromUser: true, book: true },
    });

    return this.toResponse(withRelations!);
  }

  async update(
    userId: string,
    recommendationId: string,
    updateDto: UpdateRecommendationDto,
  ): Promise<RecommendationResponse> {
    const recommendation = await this.findOwnedRecommendationOrFail(
      userId,
      recommendationId,
    );

    if (updateDto.rating !== undefined) {
      recommendation.rating = updateDto.rating;
    }

    if (updateDto.message !== undefined) {
      recommendation.message = updateDto.message;
    }

    const saved = await this.recommendationsRepository.save(recommendation);
    return this.toResponse(saved);
  }

  async remove(userId: string, recommendationId: string): Promise<void> {
    const recommendation = await this.findOwnedRecommendationOrFail(
      userId,
      recommendationId,
    );
    await this.recommendationsRepository.remove(recommendation);
  }

  async findByUser(userId: string): Promise<RecommendationResponse[]> {
    const recommendations = await this.recommendationsRepository.find({
      where: { fromUser: { id: userId } },
      relations: { fromUser: true, book: true },
      order: { createdAt: 'DESC' },
    });

    return recommendations.map((item) => this.toResponse(item));
  }

  async findFriendsRecommendations(
    userId: string,
  ): Promise<RecommendationResponse[]> {
    const friends = await this.followsService.getFriends(userId);
    if (friends.length === 0) {
      return [];
    }

    const friendIds = friends.map((friend) => friend.id);
    const recommendations = await this.recommendationsRepository.find({
      where: { fromUser: { id: In(friendIds) } },
      relations: { fromUser: true, book: true },
      order: { createdAt: 'DESC' },
    });

    return recommendations.map((item) => this.toResponse(item));
  }

  private async findEligibleUserBook(
    userId: string,
    userBookId: string,
  ): Promise<UserBook> {
    const userBook = await this.userBooksRepository.findOne({
      where: { id: userBookId, user: { id: userId } },
      relations: { book: true },
    });

    if (!userBook) {
      throw new NotFoundException('Libro no encontrado en tu biblioteca');
    }

    const eligible =
      userBook.status === UserBookStatus.READ ||
      (userBook.status === UserBookStatus.READING &&
        userBook.readingProgress >= 10);

    if (!eligible) {
      throw new BadRequestException(
        'Solo puedes recomendar libros en lectura con al menos 10% de progreso o ya leídos',
      );
    }

    return userBook;
  }

  private async findOwnedRecommendationOrFail(
    userId: string,
    recommendationId: string,
  ): Promise<Recommendation> {
    const recommendation = await this.recommendationsRepository.findOne({
      where: { id: recommendationId, fromUser: { id: userId } },
      relations: { fromUser: true, book: true },
    });

    if (!recommendation) {
      throw new NotFoundException('Recomendación no encontrada');
    }

    return recommendation;
  }

  private toResponse(recommendation: Recommendation): RecommendationResponse {
    return {
      id: recommendation.id,
      rating: recommendation.rating,
      message: recommendation.message,
      createdAt: recommendation.createdAt,
      user: {
        id: recommendation.fromUser.id,
        name: recommendation.fromUser.name,
      },
      book: {
        id: recommendation.book.id,
        externalApiId: recommendation.book.externalApiId,
        title: recommendation.book.title,
        authors: recommendation.book.authors,
        thumbnailUrl: recommendation.book.thumbnailUrl,
        description: recommendation.book.description,
        pageCount: recommendation.book.pageCount,
      },
    };
  }
}
