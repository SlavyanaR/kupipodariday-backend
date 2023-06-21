import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/jwt.guard';
//import { RequestWithUser } from 'src/utils/request-with-user';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../utils/auth-user.decorator';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  getOffers(): Promise<Offer[]> {
    return this.offersService.getOffers();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Offer> {
    return this.offersService.getById(id);
  }
}
