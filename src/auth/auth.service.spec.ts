import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mocked-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should signup a new user', async () => {
    mockUsersService.findByEmail.mockResolvedValue(undefined);
    mockUsersService.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });

    const result = await service.signup('test@example.com', 'password123');
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockUsersService.create).toHaveBeenCalled();
  });

  it('should login successfully', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashed,
    });

    const result = await service.login('test@example.com', 'password123');
    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
  });
});
