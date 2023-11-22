import { Reflector } from "@nestjs/core";

export class ReflectorMock extends Reflector {
  set = jest.fn();
  get = jest.fn();
}