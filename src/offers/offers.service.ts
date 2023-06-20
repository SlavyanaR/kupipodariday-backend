import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import queryRunner from 'src/utils/queryRunner';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly dataSource: DataSource,
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) { }

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, hidden, itemId } = createOfferDto;

    const item = await this.wishesService.findOne(itemId);

    if (item.owner.id === user.id) {
      throw new ForbiddenException('Вы не можете вносить деньги на собственные подарки',);
    }
    const raised = item.raised + amount;

    if (amount + raised > item.price) {
      throw new ForbiddenException(
        `Сумма взноса превышает сумму остатка стоимости подарка: ${item.price - raised
        } руб.`,
      );
    }

    const offer = this.offerRepository.create({
      amount,
      hidden,
      user,
      item,
    });

    await queryRunner(this.dataSource, [
      this.wishesService.updateRaised(itemId, raised),
      this.offerRepository.save(offer),
    ]);

    return offer;
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }

  async getOffers(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: { user: true, item: true },
    });
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
