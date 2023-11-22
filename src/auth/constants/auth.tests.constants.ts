import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../auth.constants";

export const HEADER_NO_TOKEN = {
  headers: { authorization: undefined }
}

export const HEADER_INVALID_TOKEN = {
  headers: { authorization: 'Bearer invalid-token'}
}

export const HEADER_VALID_TOKEN = {
  headers: { authorization: 'Bearer invalid-token'}
}

export const getValidToken = ({id = 1, email = "test@gmail.com", role = "user"}) => {
  const jwtService = new JwtService();
  return jwtService.sign({ id, email, role }, { secret: jwtConstants.secret });
}