import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../utils/auth-user.decorator';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  getWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.getWishlists();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    return this.wishlistsService.remove(id, user.id);
  }
}
