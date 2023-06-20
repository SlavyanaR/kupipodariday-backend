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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { AuthUser } from 'src/utils/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user.id);
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
  getById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<UpdateResult> {
    return this.wishesService.update(id, user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    return this.wishesService.remove(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: number, @AuthUser() user: User): Promise<Wish> {
    return this.wishesService.copy(id, user);
  }
}
