import { Request, Response } from "express";
import config from "config";
import { createSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

const createUserSessionHandler = async (
  request: Request,
  response: Response
) => {
  // Validate User password
  const user = await validatePassword(request.body);

  if (!user) {
    return response.status(401).send("Invalid email or password");
  }

  // Create a session
  const session = await createSession(
    user._id,
    request.get("user-agent") || ""
  );

  // Create a access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") }
  );

  // Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTtl") }
  );

  // return access & refresh tokens
  return response.send({ accessToken, refreshToken });
};

export { createUserSessionHandler };
