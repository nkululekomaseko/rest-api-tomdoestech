import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";

export const createUserHandler = async (
  request: Request<{}, {}, CreateUserInput["body"]>,
  response: Response
) => {
  try {
    const user = await createUser(request.body);
    return response.send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    logger.error(error);
    return response.status(409).send(error.message);
  }
};
