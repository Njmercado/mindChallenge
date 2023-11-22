import { JwtService } from "@nestjs/jwt";

export class JwtServiceMock extends JwtService {
  verifyAsync = jest.fn();
  signAsync = jest.fn(); 
}