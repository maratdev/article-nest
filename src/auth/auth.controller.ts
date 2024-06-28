import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() dto: UserAuthDto) {
    return this.authService.registerUser(dto);
  }
}
