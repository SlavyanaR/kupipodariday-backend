import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestWithUser) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getOffers() {
    return this.offersService.getOffers();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.offersService.getById(+id);
  }
}
