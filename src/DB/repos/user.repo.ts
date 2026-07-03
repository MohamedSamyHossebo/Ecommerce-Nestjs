import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HUserDocument, User } from '../Models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<HUserDocument> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<HUserDocument>,
  ) {
    super(model);
  }
}
