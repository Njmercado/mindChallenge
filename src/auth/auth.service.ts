import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const isNotValid = !user || !(await bcrypt.compare(password, user.password));
    if(isNotValid) {
      throw new UnauthorizedException({
        message: "Invalid credentials, please try again",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const token = {
      access_token: this.jwtService.sign(payload),
    };

    return token;
  }
}
