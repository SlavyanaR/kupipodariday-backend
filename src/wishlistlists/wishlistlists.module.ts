import { Module } from '@nestjs/common';
import { WishlistlistsService } from './wishlistlists.service';
import { WishlistlistsController } from './wishlistlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlistlist } from './entities/wishlistlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlistlist])],
  controllers: [WishlistlistsController],
  providers: [WishlistlistsService],
  exports: [WishlistlistsService],
})
export class WishlistlistsModule {}
