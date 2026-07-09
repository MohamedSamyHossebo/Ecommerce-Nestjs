import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Category {
  @Prop({ type: String, required: true, trim: true, unique: true })
  name!: string;
  @Prop({ type: String, required: true })
  logo!: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type HCategoryDocument = HydratedDocument<Category>;
export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: CategorySchema,
  },
]);
// Cascade DELETE Hook
const cascadeDeleteHook = async function (this: mongoose.Query<any, any>) {
  const docs = await this.model.find(this.getQuery());
  if (docs.length > 0) {
    const categoryIds = docs.map((doc) => doc._id);
    const ProductModel = this.model.db.model('Product');
    await ProductModel.deleteMany({ category: { $in: categoryIds } });
  }
};

CategorySchema.pre(
  'deleteOne',
  { document: false, query: true } as any,
  cascadeDeleteHook as any,
);
CategorySchema.pre(
  'findOneAndDelete',
  { document: false, query: true } as any,
  cascadeDeleteHook as any,
);
CategorySchema.pre(
  'deleteMany',
  { document: false, query: true } as any,
  cascadeDeleteHook as any,
);
