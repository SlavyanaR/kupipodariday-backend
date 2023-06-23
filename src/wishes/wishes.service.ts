import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { DataSource, DeleteResult, In, Repository, UpdateResult, } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import queryRunner from '../utils/queryRunner';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    await this.checkDuplicate(createWishDto, user);

    const newWish = await this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });

    return this.wishRepository.save(newWish);
  }

  async findMany(wishesIds: number[]): Promise<Wish[]> {
    return this.wishRepository.find({ where: { id: In(wishesIds) } });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
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
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя редактировать или удалять чужие подарки');
    }

    if (wish.raised && updateWishDto.price > 0) {
      throw new ForbiddenException('В вашем вишлисте уже есть этот подарок');
    }

    return this.wishRepository.update({ id }, updateWishDto);
  }

  async checkDuplicate(createWishDto: CreateWishDto, user: User) {
    const { name, link, price } = createWishDto;

    const wish = await this.wishRepository.findOne({
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

  async updateRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishRepository.update({ id }, { raised });
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя редактировать или удалять чужие подарки');
    }

    return this.wishRepository.delete(id);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    await this.checkDuplicate(wish, user);

    const { name, link, image, price, description } = wish;

    const copiedWish = await this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      owner: user,
    });

    await queryRunner(this.dataSource, [
      this.wishRepository.update({ id: wish.id }, { copied: ++wish.copied }),
      this.wishRepository.save(copiedWish),
    ]);

    return copiedWish;
  }
}
