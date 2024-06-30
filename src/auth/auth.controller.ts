import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { GetCurrentUser } from './decorators/get-user.decorator';
import { AtGuard } from '../config/guards/at.guard';
import { RtGuard } from '../config/guards/rt.guard';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: UserAuthDto) {
    return this.authService.registerUser(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('userId', ParseUUIDPipe) id: string) {
    return this.authService.logout(id);
  }
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUser('jwt') refreshToken: string,
    @GetCurrentUser('userId') id: string,
  ) {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
