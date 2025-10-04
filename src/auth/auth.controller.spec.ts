import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call signup and return result', async () => {
    const dto: AuthDto = { email: 'test@example.com', password: 'password123' };
    mockAuthService.signup.mockResolvedValue({ id: 1, email: dto.email });

    const result = await controller.signup(dto);
    expect(result).toEqual({ id: 1, email: dto.email });
    expect(mockAuthService.signup).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
  });

  it('should call login and return JWT token', async () => {
    const dto: AuthDto = { email: 'test@example.com', password: 'password123' };
    mockAuthService.login.mockResolvedValue({
      access_token: 'mocked-jwt-token',
    });

    const result = await controller.login(dto);
    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(dto.email, dto.password);
  });
});
