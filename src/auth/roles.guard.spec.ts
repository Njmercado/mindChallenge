import { RolesGuard } from './roles.guard';
import { ReflectorMock } from './mocks/reflector.mock';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: ReflectorMock;

  beforeEach(() => {
    reflector = new ReflectorMock();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should not allow access when no roles are defined', async () => {

    reflector.get = jest.fn().mockReturnValue([]);

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
      getHandler: () => undefined,
    };

    expect(rolesGuard.canActivate(context)).toBeFalsy();
  });

  it('should deny access when user role does not match required roles', async () => {
    reflector.get = jest.fn().mockReturnValue(["admin"]);

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'user' } }),
      }),
      getHandler: () => ({ handler: () => {} }),
    };

    expect(rolesGuard.canActivate(context)).toBeFalsy();
  });

  it('should allow access when user role matches at least one required role', async () => {
    reflector.get = jest.fn().mockReturnValue(["admin"]);

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
      getHandler: () => ({ handler: () => {} }),
    };

    expect(rolesGuard.canActivate(context)).toBeTruthy();
  });
});