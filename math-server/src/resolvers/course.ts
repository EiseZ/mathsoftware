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
import { Subject } from "../entities/Subject";

@ObjectType()
class CourseOrError {
  @Field({ nullable: true })
  error?: String;
  @Field({ nullable: true })
  course?: Course;
}

@ObjectType()
class CoursesOrError {
  @Field({ nullable: true })
  error?: String;
  @Field(() => [Course], { nullable: true })
  courses?: Course[];
}

@Resolver()
export class CourseResolver {
  // Return all courses
  @Query(() => [Course])
  async courses(@Ctx() { manager }: MyContext) {
    const courses = await manager.find(Course);
    return courses;
  }

  // Return all courses with a specific subject
  @Query(() => CoursesOrError)
  async coursesWithSubject(
    @Ctx() { manager }: MyContext,
    @Arg("subjectName", () => String) subjectName: string
  ) {
    if (subjectName) {
      const subject = await manager.findOne(Subject, { name: subjectName });
      if (subject) {
        const courses = await manager.find(Course, { subject: subject });
        return { courses: courses };
      } else {
        return {
          error: "An error occurred when searching for the subject.",
        };
      }
    } else {
      return {
        error: "An error occurred when searching for the subject.",
      };
    }
  }

  // Create a course
  @Mutation(() => CourseOrError)
  async createCourse(
    @Arg("name", () => String) name: string,
    @Arg("subjectName", () => String) subjectName: string,
    @Ctx() { manager }: MyContext
  ) {
    const course = new Course();
    if (name) {
      course.name = name;
    } else {
      return {
        error: "An error occurred when naming the course.",
      };
    }
    if (subjectName) {
      const subject = await manager.findOne(Subject, { name: subjectName });
      if (subject) {
        course.subject = subject;
      } else {
        return {
          error: "An error occurred when creating courses on the subject.",
        };
      }
    } else {
      return {
        error: "An error occurred when creating courses on the subject.",
      };
    }

    await manager.save(course).catch((err) => {
      console.log(err);
      return {
        error: "An error occurred when creating the course.",
      };
    });

    return {
      course: course,
    };
  }
}
