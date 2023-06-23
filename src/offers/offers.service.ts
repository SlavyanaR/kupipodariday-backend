import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import queryRunner from '../utils/queryRunner';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, hidden, itemId } = createOfferDto;

    const item = await this.wishesService.findOne(itemId);

    if (item.owner.id === user.id) {
      throw new ForbiddenException( 'Вы не можете вносить деньги на собственные подарки');
    }

    const raised = item.raised + amount;

    if (raised > item.price) {
      throw new ForbiddenException(`Сумма взноса превышает сумму остатка стоимости подарка`);
    }

    const offer  = await this.offerRepository.create({
      amount,
      hidden,
      user,
      item,
    });

    await queryRunner(this.dataSource, [
      this.wishesService.updateRaised(itemId, raised),
      this.offerRepository.save(offer ),
    ]);

    return offer;
  }

  async getOffers(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: { user: true, item: true } });
  }

  async getById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });

    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }

    return offer;
  }
}
