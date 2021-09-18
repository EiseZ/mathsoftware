import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { MyContext } from "../types";
import { Subject } from "../entities/Subject";

@ObjectType()
class SubjectOrError {
  @Field({ nullable: true })
  error?: String;
  @Field({ nullable: true })
  subject?: Subject;
}

@Resolver()
export class SubjectResolver {
  // Return all subjects
  @Query(() => [Subject])
  async subjects(@Ctx() { manager }: MyContext) {
    const subjects = await manager.find(Subject);
    return subjects;
  }

  // Return subject with name
  @Query(() => SubjectOrError)
  async subject(
    @Ctx() { manager }: MyContext,
    @Arg("name", () => String) name: string
  ) {
    const subject = await manager.findOne(Subject, { name: name });
    if (subject) {
      return { subject: subject };
    } else {
      return { error: "An error occurred when finding the subject." };
    }
  }

  // Create a subject
  @Mutation(() => SubjectOrError)
  async createSubject(
    @Arg("name", () => String) name: string,
    @Ctx() { manager }: MyContext
  ) {
    const subject = new Subject();
    if (name) {
      subject.name = name;
    } else {
      return {
        error: "An error occurred when naming the subject.",
      };
    }

    await manager.save(subject).catch((err) => {
      console.log(err);
      return {
        error: "An error occurred when creating the subject.",
      };
    });

    return {
      subject: subject,
    };
  }
}
