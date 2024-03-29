import { Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export const createUserSessionHandler = async (
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
  response.cookie("accessToken", accessToken, {
    maxAge: 900000, //15min
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  response.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, //1y
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  return response.send({ accessToken, refreshToken });
};

export const getUserSessionsHandler = async (
  request: Request,
  response: Response
) => {
  const userId = response.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return response.send(sessions);
};

export const deleteSessionHandler = async (
  request: Request,
  response: Response
) => {
  const sessionId = response.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return response.send({
    accessToken: null,
    refreshToken: null,
  });
};
