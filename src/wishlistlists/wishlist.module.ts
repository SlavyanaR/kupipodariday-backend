import { Module } from '@nestjs/common';
import { WishlistlistsService } from './wishlist.service';
import { WishlistlistsController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistlistsController],
  providers: [WishlistlistsService],
  exports: [WishlistlistsService],
})
export class WishlistsModule {}
