import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const user = await this.findOne({ where: [{ email }, { username }] });

    if (user) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hash = await this.hashService.generate(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.userRepository.save(newUser);
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const isExist = !!(await this.findOne({
      where: [{ email }, { username }],
    }));

    if (isExist)
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );

    const user = await this.findOne({ where: { id } });

    if (password) {
      updateUserDto.password = await this.hashService.generate(password);
    }

    const updatedUser = { ...user, ...updateUserDto };
    await this.userRepository.update(id, updatedUser);

    return this.findOne({ where: { id } });
  }

  getByUsername(username: string) {
    return this.findOne({
      where: { username },
    });
  }

  async getUserWishes(userId: number) {
    const user = await this.findOne({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    });

    return user.wishes;
  }

  async getAnotherUserWishes(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    });

    return user.wishes;
  }

  findByUsernameOrEmail(query: string) {
    return this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }
}
