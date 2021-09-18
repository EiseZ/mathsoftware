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
import { Course } from "../entities/Course";
import { Exercise } from "../entities/Exercise";

@ObjectType()
class ExerciseOrError {
  @Field({ nullable: true })
  error?: String;
  @Field({ nullable: true })
  exercise?: Exercise;
}

@ObjectType()
class ExercisesOrError {
  @Field({ nullable: true })
  error?: String;
  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[];
}

@Resolver()
export class ExerciseResolver {
  // Return all courses
  @Query(() => [Exercise])
  async exercises(@Ctx() { manager }: MyContext) {
    const exercises = await manager.find(Exercise);
    return exercises;
  }

  // Return all courses with a specific subject
  @Query(() => ExercisesOrError)
  async exercisesWithCourse(
    @Ctx() { manager }: MyContext,
    @Arg("courseName", () => String) courseName: string
  ) {
    if (courseName) {
      const course = await manager.findOne(Course, { name: courseName });
      if (course) {
        const exercices = await manager.find(Exercise, { course: course });
        return { exercises: exercices };
      } else {
        return {
          error: "An error occurred when searching for the course.",
        };
      }
    } else {
      return {
        error: "An error occurred when searching for the course.",
      };
    }
  }

  // Create a course
  @Mutation(() => ExerciseOrError)
  async createExercise(
    @Arg("question", () => String) question: string,
    @Arg("type", () => String) type: string,
    @Arg("courseName", () => String) courseName: string,

    @Arg("multipleChoiceAwnser1", () => String, { nullable: true })
    multipleChoiceAwnser1: string,
    @Arg("multipleChoiceAwnser2", () => String, { nullable: true })
    multipleChoiceAwnser2: string,
    @Arg("multipleChoiceAwnser3", () => String, { nullable: true })
    multipleChoiceAwnser3: string,
    @Arg("multipleChoiceAwnser4", () => String, { nullable: true })
    multipleChoiceAwnser4: string,
    @Arg("multipleChoiceAwnser5", () => String, { nullable: true })
    multipleChoiceAwnser5: string,

    @Arg("openAwnser", () => String, { nullable: true })
    openAwnser: string,

    @Ctx()
    { manager }: MyContext
  ) {
    const exercise = new Exercise();
    if (question) {
      exercise.question = question;
    } else {
      return {
        error: "An error occurred when setting the question.",
      };
    }
    switch (type) {
      case "multiple-choice-2":
      case "multiple-choice-3":
      case "multiple-choice-4":
      case "multiple-choice-5":
      case "multiple-choice-2-multiple":
      case "multiple-choice-3-multiple":
      case "multiple-choice-4-multiple":
      case "multiple-choice-5-multiple":
        exercise.multipleChoiceAwnser1 = multipleChoiceAwnser1;
        exercise.multipleChoiceAwnser2 = multipleChoiceAwnser2;
        exercise.multipleChoiceAwnser3 = multipleChoiceAwnser3;
        exercise.multipleChoiceAwnser4 = multipleChoiceAwnser4;
        exercise.multipleChoiceAwnser5 = multipleChoiceAwnser5;
        break;
      case "true-or-false":
        type = "multiple-choice-2";
        exercise.multipleChoiceAwnser1 = "Waar";
        exercise.multipleChoiceAwnser2 = "Niet Waar";
        break;
      case "open":
        exercise.openAwnser = openAwnser;
        break;
      default:
        return {
          error: "An error occurred when setting the type.",
        };
        break;
    }
    exercise.type = type;
    if (courseName) {
      const course = await manager.findOne(Course, { name: courseName });
      if (course) {
        exercise.course = course;
      } else {
        return {
          error: "An error occurred when setting the course.",
        };
      }
    } else {
      return {
        error: "An error occurred when setting the course.",
      };
    }

    await manager.save(exercise).catch((err) => {
      console.log(err);
      return {
        error: "An error occurred when creating the exercise.",
      };
    });

    return {
      exercise: exercise,
    };
  }
}
