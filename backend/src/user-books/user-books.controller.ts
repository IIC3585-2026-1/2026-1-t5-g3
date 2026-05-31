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
import { CreateUserBookDto } from './dto/create-user-book.dto';
import { UpdateUserBookProgressDto } from './dto/update-user-book-progress.dto';
import { UpdateUserBookStatusDto } from './dto/update-user-book-status.dto';
import { UserBooksService } from './user-books.service';

@Controller('user-books')
@UseGuards(JwtAuthGuard)
export class UserBooksController {
  constructor(private readonly userBooksService: UserBooksService) {}

  @Get('me')
  findMine(@Request() req: { user: { id: string } }) {
    return this.userBooksService.findAllForUser(req.user.id);
  }

  @Get('dashboard')
  getDashboard(@Request() req: { user: { id: string } }) {
    return this.userBooksService.getDashboard(req.user.id);
  }

  @Post()
  create(
    @Request() req: { user: { id: string } },
    @Body() createUserBookDto: CreateUserBookDto,
  ) {
    return this.userBooksService.addBook(req.user.id, createUserBookDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateDto: UpdateUserBookStatusDto,
  ) {
    return this.userBooksService.updateStatus(req.user.id, id, updateDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateDto: UpdateUserBookProgressDto,
  ) {
    return this.userBooksService.updateProgress(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.userBooksService.remove(req.user.id, id);
  }
}
