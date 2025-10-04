import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { email: 'test@example.com', password: 'pass' };
    mockUsersService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    mockUsersService.findAll.mockResolvedValue(users);

    const result = await controller.findAll();
    expect(result).toEqual(users);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const user = { id: 1, email: 'test@example.com' };
    mockUsersService.findOne.mockResolvedValue(user);

    const result = await controller.findOne('1');
    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUsersService.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const attrs = { email: 'updated@example.com' };
    mockUsersService.update.mockResolvedValue({ id: 1, ...attrs });

    const result = await controller.update('1', attrs);
    expect(result).toEqual({ id: 1, ...attrs });
    expect(mockUsersService.update).toHaveBeenCalledWith('1', attrs);
  });

  it('should remove a user', async () => {
    mockUsersService.remove.mockResolvedValue({ deleted: true, id: 1 });

    const result = await controller.remove('1');
    expect(result).toEqual({ deleted: true, id: 1 });
    expect(mockUsersService.remove).toHaveBeenCalledWith('1');
  });
});
