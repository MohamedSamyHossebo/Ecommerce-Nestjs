import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { CacheInterceptor } from 'src/cache/interceptors/cache.interceptor';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @UseInterceptors(CacheInterceptor)
  async findAll(
    @Param('productId') productId: string,
    @Query() query: PaginationDto,
  ): Promise<any> {
    const reviews = await this.reviewsService.findByProduct(productId, query);
    return {
      message: 'Reviews fetched successfully',
      ...reviews,
    };
  }

  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.USER, UserRoleEnum.ADMIN))
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateReviewDto,
  ): Promise<any> {
    const userId = (req as any).user._id;
    const review = await this.reviewsService.create(dto, userId);
    return {
      message: 'Review created successfully',
      ...review.toJSON(),
    };
  }

  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.USER, UserRoleEnum.ADMIN))
  @Patch(':reviewId')
  async update(
    @Req() req: Request,
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<any> {
    const userId = (req as any).user._id;
    const review = await this.reviewsService.update(reviewId, dto, userId);
    return {
      message: 'Review updated successfully',
      ...review.toJSON(),
    };
  }

  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.USER, UserRoleEnum.ADMIN))
  @Delete(':reviewId')
  async remove(
    @Req() req: Request,
    @Param('reviewId') reviewId: string,
  ): Promise<any> {
    const userId = (req as any).user._id;
    const review = await this.reviewsService.remove(reviewId, userId);
    return {
      message: 'Review deleted successfully',
      ...review,
    };
  }
}
