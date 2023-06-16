import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { User } from './users/entities/user.entity';
import { WishesModule } from './wishes/wishes.module';
import { WishlistlistsModule } from './wishlistlists/wishlistlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    UsersModule,
    WishesModule,
    WishlistlistsModule,
    OffersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
