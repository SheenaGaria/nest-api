import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signup route
  @Post('signup')
  async signup(@Body() body: AuthDto) {
    return this.authService.signup(body.email, body.password);
  }

  // Login route
  @Post('login')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }
}
