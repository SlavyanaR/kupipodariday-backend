import { ForbiddenException, Injectable } from '@nestjs/common';

import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  getLastWishes() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  getTopWishes() {
    return this.findMany({ order: { copied: 'DESC' }, take: 10 });
  }

  getById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    this.wishesRepository.delete(id);
    return wish;
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.findOne({ where: { id: wishId } });

    const { name, description, image, link, price, copied } = wish;

    const isExist = !!(await this.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: userId },
      },
      relations: { owner: true },
    }));

    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, wishId, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }
}
