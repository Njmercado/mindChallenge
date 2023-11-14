import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if(!user.comparePassword(password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id.toString(), email: user.email, password: user.password, role: user.role };
    const token = {
      access_token: this.jwtService.sign(payload),
    };

    return token;
  }
}
