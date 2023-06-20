import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const items = await this.wishesService.findMany(createWishlistDto.itemsId);

    if (!items.length) {
      throw new NotFoundException('Ни одного подарка не найдено');
    }

    const newWishlist = await this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner,
    });

    return this.wishlistsRepository.save(newWishlist);
  }

  async getWishlists(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async getById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wishlist = await this.getById(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }
    return this.wishlistsRepository.update(id, updateWishlistDto);
  }

  async delete(id: number, userId: number): Promise<DeleteResult> {
    const wishlist = await this.getById(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете удалять чужие списки подарков',
      );
    }

    return this.wishlistsRepository.delete(id);
  }
}
