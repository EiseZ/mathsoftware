import { Request, Response } from "express";
import { EntityManager } from "typeorm";

export type MyContext = {
  manager: EntityManager;
  res: Response;
  req: Request;
};
