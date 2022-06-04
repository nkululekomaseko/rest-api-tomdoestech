import { Express, Request, Response } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

const routes = (app: Express) => {
  app.get("/healthcheck", (request: Request, response: Response) => {
    response.sendStatus(200);
  });

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
};

export default routes;
