import { AuthGuard } from './auth.guard';
import { JwtServiceMock } from './mocks/jwt.service.mock';
import { getValidToken } from './constants/auth.tests.constants';
import { UnauthorizedException } from '@nestjs/common';
import { USER_DATA } from '../user/contants/user.spec.contants';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtServiceMock;

  beforeEach(() => {
    jwtService = new JwtServiceMock();
    authGuard = new AuthGuard(jwtService);
  });

  it('should throw an UnauthorizedException when no token is provided', async () => {
    const request = { headers: { authorization: undefined } };
    const context: any = { switchToHttp: () => ({ getRequest: () => request }) };

    jwtService.verifyAsync = jest.fn().mockRejectedValue(new UnauthorizedException());

    await expect(authGuard.canActivate(context)).rejects.toEqual(new UnauthorizedException());
  });

  it('should throw an UnauthorizedException when an invalid token is provided', async () => {
    const request = { headers: { authorization: 'Bearer invalid-token' } };
    const context: any = { switchToHttp: () => ({ getRequest: () => request }) };

    jwtService.verifyAsync = jest.fn().mockRejectedValue(new UnauthorizedException());

    await expect(authGuard.canActivate(context)).rejects.toEqual(new UnauthorizedException());
  });

  it('should successfully validate a valid token and attach the user payload to the request', async () => {
    const token = getValidToken({});
    const request = { headers: { authorization: `Bearer ${token}` } };
    const context: any = { switchToHttp: () => ({ getRequest: () => request }) };

    jwtService.verifyAsync.mockReturnValue({
      id: USER_DATA['id'],
      email: USER_DATA.email,
      role: USER_DATA.role,
    });

    expect(await authGuard.canActivate(context)).toBeTruthy();
    expect(request['user']).toEqual({
      id: USER_DATA['id'],
      email: USER_DATA.email,
      role: USER_DATA.role,
    });
  });
});