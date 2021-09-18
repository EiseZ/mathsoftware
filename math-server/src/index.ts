import "reflect-metadata";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cors from "cors";

import { SubjectResolver } from "./resolvers/subject";
import { CourseResolver } from "./resolvers/course";
import { ExerciseResolver } from "./resolvers/exercise";

async function main() {
  const conn = await createConnection(); // Create typeorm connection

  const app = express(); // Create express app
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Create apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [SubjectResolver, CourseResolver, ExerciseResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      manager: conn.manager,
      req,
      res,
    }),
  });

  await apolloServer.start(); // Start apollo server

  // Apply express app to apollo server
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Set response at /
  app.get("/", (_, res) => {
    res.send("MathSoftware - Server - v0.0.1 >>> Server request succesfull");
  });

  // Listen on localhost:4000
  app.listen(4000, () => {
    console.log("🚀 Server started on localhost:4000");
  });
}

main();
