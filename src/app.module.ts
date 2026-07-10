import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { OrderModule } from './modules/order/order.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        dbName: configService.get<string>('DB_NAME'),
        onConnectionCreate(connection: Connection) {
          connection.on('connected', () => {
            console.log(
              `${configService.get<string>('DB_NAME')} connection established successfully on ${configService.get<string>('DB_URI')}`,
            );
          });
        },
      }),
    }),
    AuthModule,
    MailModule,
    EventEmitterModule.forRoot(),
    UserModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    ReviewsModule,
    CouponsModule,
    OrderModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
