import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlist.service';
import { WishlistlistsController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WishlistlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
