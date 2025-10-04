import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', password: '123456' };
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto);
    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      password: '123456',
    });
  });

  it('should return all users', async () => {
    const users = [{ id: '1', email: 'a@b.com', password: 'pass' }];
    mockRepo.find.mockResolvedValue(users);
    const result = await service.findAll();
    expect(result).toEqual(users);
  });
});
