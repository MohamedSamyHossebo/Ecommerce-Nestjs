import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HReviewDocument, Review } from '../Models/reviews.model';

@Injectable()
export class ReviewRepository extends BaseRepository<HReviewDocument> {
  constructor(
    @InjectModel(Review.name)
    protected override readonly model: Model<HReviewDocument>,
  ) {
    super(model);
  }
}
