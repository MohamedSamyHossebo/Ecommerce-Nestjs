import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from 'src/DB/repos/reviews.repo';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { PaginationDto } from './../../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private reviewRepo: ReviewRepository,
    private productRepo: ProductRepository,
  ) {}

  async create(dto: CreateReviewDto, userId: string) {
    const productExists = await this.productRepo.findOne({
      _id: dto.productId,
    });
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }
    const alreadyReviewd = await this.reviewRepo.findOne({
      productId: dto.productId,
      userId: userId,
    });
    if (alreadyReviewd) {
      throw new ConflictException('You have already reviewed this product');
    }
    const newReview = await this.reviewRepo.create({
      ...dto,
      userId: userId,
    });
    return (
      await (
        await newReview.save()
      ).populate('userId', 'firstName lastName email')
    ).populate('productId');
  }
  async update(reviewId: string, dto: UpdateReviewDto, userId: string) {
    const reviewExists = await this.reviewRepo.findOne({
      _id: reviewId,
      userId: userId,
    });
    if (!reviewExists) {
      throw new NotFoundException('Review not found');
    }
    if (dto.rating) {
      reviewExists.rating = dto.rating;
    }
    if (dto.comment) {
      reviewExists.comment = dto.comment;
    }
    return await (
      await reviewExists.save()
    ).populate('userId', 'firstName lastName email');
  }
  async remove(reviewId: string, userId: string) {
    const reviewExists = await this.reviewRepo.findOne({
      _id: reviewId,
      userId: userId,
    });
    if (!reviewExists) {
      throw new NotFoundException('Review not found');
    }
    return await this.reviewRepo.deleteOne({ _id: reviewId });
  }
  async findByProduct(productId: string, query: PaginationDto) {
    const reviews = await this.reviewRepo.paginate(
      { productId: productId },
      {
        ...query,
        populate: [
          { path: 'userId', select: 'firstName lastName email' },
          { path: 'productId' },
        ],
      },
    );
    return reviews;
  }
}
