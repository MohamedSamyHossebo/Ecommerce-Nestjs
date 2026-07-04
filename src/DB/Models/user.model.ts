import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ProviderEnum,
  UserGenderEnum,
  UserRoleEnum,
} from 'src/common/enums/user.enum';
import { HydratedDocument } from 'mongoose';
import { hash } from 'src/common/security/hash.security';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: [3, 'First name must be at least 3 characters long'],
    maxLength: [50, 'First name must be at most 50 characters long'],
    trim: true,
  })
  firstName!: string;
  @Prop({
    type: String,
    required: true,
    minlength: [3, 'Last name must be at least 3 characters long'],
    maxLength: [50, 'Last name must be at most 50 characters long'],
    trim: true,
  })
  lastName!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: function (this: any) {
      return this.provider === ProviderEnum.GOOGLE ? false : true;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    maxLength: [100, 'Password must be at most 100 characters long'],
  })
  password!: string;

  @Prop({
    type: Date,
  })
  confirmEmail!: Date;

  @Prop({
    type: String,
    default: undefined,
  })
  confirmEmailOTP!: string | undefined;
  @Prop({
    type: String,
    default: undefined,
  })
  otpExpiresAt!: Date | undefined;

  @Prop({
    type: String,
    default: undefined,
  })
  forgetPasswordOTP!: string | undefined;

  @Prop({
    type: Date,
    default: undefined,
  })
  forgetPasswordOTPExpiresAt!: Date | undefined;

  @Prop({
    type: String,
    enum: {
      values: Object.values(UserGenderEnum),
      default: UserGenderEnum.MALE,
    },
  })
  gender!: string;

  @Prop({
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM,
  })
  provider!: string;

  @Prop({
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.USER,
  })
  role!: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName')
  .get(function (this: User) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (this: User, fullName: string) {
    const [firstName, lastName] = fullName.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  });
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
});
export type HUserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
