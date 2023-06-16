import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../hash/hash.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

type SpyInstance = jest.SpyInstance;

describe('UsersService', () => {
  const mockedUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockedHashService = {
    generate: jest.fn(),
  };

  let user: User;

  let repoFindOneSpy: SpyInstance;
  let repoCreateSpy: SpyInstance;
  let repoSaveSpy: SpyInstance;
  let repoUpdateSpy: SpyInstance;
  let hashGenerateSpy: SpyInstance;

  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockedUserRepository },
        { provide: HashService, useValue: mockedHashService },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);

    repoFindOneSpy = jest.spyOn(mockedUserRepository, 'findOne');
    hashGenerateSpy = jest.spyOn(mockedHashService, 'generate');
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('when create a new user', () => {
    const createUserDto = plainToInstance(CreateUserDto, {
      username: 'test-username',
      email: 'test-email',
      password: 'test-password',
    });

    user = plainToInstance(User, {
      username: 'test-username',
      email: 'test-email',
      password: 'hashed-password',
    });

    beforeEach(() => {
      repoCreateSpy = jest.spyOn(mockedUserRepository, 'create');
      repoSaveSpy = jest.spyOn(mockedUserRepository, 'save');
    });

    it('should return a new User instance', async () => {
      repoFindOneSpy.mockResolvedValue(null);
      hashGenerateSpy.mockResolvedValue('hashed-password');
      repoCreateSpy.mockReturnValue(user);
      repoSaveSpy.mockResolvedValue(user);

      expect(await usersService.create(createUserDto)).toEqual(user);

      expect(repoFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      expect(hashGenerateSpy).toHaveBeenNthCalledWith(
        1,
        createUserDto.password,
      );

      expect(repoCreateSpy).toHaveBeenNthCalledWith(1, {
        username: 'test-username',
        email: 'test-email',
        password: 'hashed-password',
      });

      expect(repoSaveSpy).toHaveBeenNthCalledWith(1, user);
    });

    it('should throw exception on unique username or email conflict', () => {
      repoFindOneSpy.mockResolvedValue(user);

      expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(repoFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      expect(hashGenerateSpy).not.toHaveBeenCalled();
      expect(repoCreateSpy).not.toHaveBeenCalled();
      expect(repoSaveSpy).not.toHaveBeenCalled();
    });
  });

  describe('when update user`s password', () => {
    const updateUserDto = plainToInstance(UpdateUserDto, {
      password: 'test-password',
    });

    const userWithOldPass = plainToInstance(User, {
      id: 1,
      password: 'old-password',
    });

    user = plainToInstance(User, {
      id: 1,
      password: 'hashed-password',
    });

    beforeEach(() => {
      repoUpdateSpy = jest.spyOn(mockedUserRepository, 'update');
    });

    it('should hashed new password', async () => {
      repoFindOneSpy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(userWithOldPass)
        .mockResolvedValueOnce(user);

      hashGenerateSpy.mockResolvedValue('hashed-password');

      expect(await usersService.updateOne(1, updateUserDto)).toEqual(user);

      expect(repoFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.username },
        ],
      });

      expect(repoFindOneSpy).toHaveBeenNthCalledWith(2, {
        where: { id: 1 },
      });

      expect(hashGenerateSpy).nthCalledWith(1, 'test-password');

      expect(repoUpdateSpy).nthCalledWith(1, 1, {
        id: 1,
        password: 'hashed-password',
      });

      expect(repoFindOneSpy).nthCalledWith(3, { where: { id: 1 } });
    });

    it('should throw exception on unique username or email conflict', () => {
      repoFindOneSpy.mockResolvedValue(user);

      expect(usersService.updateOne(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(repoFindOneSpy).nthCalledWith(1, {
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.username },
        ],
      });

      expect(hashGenerateSpy).not.toBeCalled();
      expect(repoUpdateSpy).not.toBeCalled();
    });
  });
});
