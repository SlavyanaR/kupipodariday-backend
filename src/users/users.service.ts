import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await this.hashService.generate(
      createUserDto.password,
    );

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    return this.userRepository.save(newUser).catch((e) => {
      if (e.code ==  '23505') {
        throw new BadRequestException( 'Пользователь с таким email или username уже зарегистрирован');
      }

      return e;
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const likeQuery = Like(`%${query}%`);

    return this.userRepository.find({
      where: [{ username: likeQuery }, { email: likeQuery }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.generate(
        updateUserDto.password,
      );
    }

    await this.userRepository.update({ id }, updateUserDto).catch((e) => {
      if (e.code == '23505') {
        throw new BadRequestException(  'Пользователь с таким email или username уже зарегистрирован');
      }

      return e;
    });

    return this.userRepository.findOneBy({ id });
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }
}
