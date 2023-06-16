import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistlistDto } from './dto/create-wishlistlist.dto';
import { UpdateWishlistlistDto } from './dto/update-wishlistlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlistlist } from './entities/wishlistlist.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class WishlistlistsService {
  constructor(
    @InjectRepository(Wishlistlist)
    private wishlistsRepository: Repository<Wishlistlist>,
  ) {}

  create(createWishlistDto: CreateWishlistlistDto, ownerId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });
    return this.wishlistsRepository.save(wishList);
  }

  findMany(query: FindManyOptions<Wishlistlist>) {
    return this.wishlistsRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlistlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  getWishlists() {
    return this.findMany({
      relations: ['items', 'owner'],
    });
  }

  getById(id: number) {
    return this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...rest, items };

    await this.wishlistsRepository.update(id, updatedWishlist);
    return this.findOne({ where: { id } });
  }

  async delete(id: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете удалять чужие списки подарков',
      );
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
