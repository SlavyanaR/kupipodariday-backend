import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AuthUser } from '../utils/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWish(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    return this.wishesService.update(id, updateWishDto, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    return this.wishesService.remove(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @AuthUser() user: User,): Promise<Wish> {
    return this.wishesService.copy(id, user);
  }
}
