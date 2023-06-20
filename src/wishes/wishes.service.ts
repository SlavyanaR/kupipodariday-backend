import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  DataSource,
  DeleteResult,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import queryRunner from 'src/utils/queryRunner';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) { }

  create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findMany(wishesIds: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { id: In(wishesIds) } });
  }


  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: { user: true },
      },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async getLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 10,
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<UpdateResult> {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return this.wishesRepository.update({ id }, updateWishDto);
  }

  async updateRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishesRepository.update({ id }, { raised });
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }
    return this.wishesRepository.delete(id);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    await this.checkDuplicate(wish, user);

    const { name, link, image, price, description } = wish;

    const copiedWish = await this.wishesRepository.create({
      name,
      link,
      image,
      price,
      description,
      owner: user,
    });

    await queryRunner(this.dataSource, [
      this.wishesRepository.update({ id: wish.id }, { copied: ++wish.copied }),
      this.wishesRepository.save(copiedWish),
    ]);

    return copiedWish;
  }

  async checkDuplicate(createWishDto: CreateWishDto, user: User) {
    const { name, link, price } = createWishDto;

    const wish = await this.wishesRepository.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: user.id },
      },
      relations: { owner: true },
    });

    if (wish) {
      throw new ForbiddenException('В вашем вишлисте уже есть этот подарок');
    }

    return;
  }
}
