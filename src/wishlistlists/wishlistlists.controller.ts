import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistlistsService } from './wishlistlists.service';
import { CreateWishlistlistDto } from './dto/create-wishlistlist.dto';
import { UpdateWishlistlistDto } from './dto/update-wishlistlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistlistsController {
  constructor(private readonly wishlistlistsService: WishlistlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  getWishlists() {
    return this.wishlistlistsService.getWishlists();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishlistlistsService.getById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistlistsService.update(
      +id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.wishlistlistsService.delete(+id, req.user.id);
  }
}
