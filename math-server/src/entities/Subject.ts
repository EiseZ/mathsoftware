import { Field, ObjectType } from "type-graphql";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Course } from "./Course";

@Entity()
@ObjectType()
export class Subject {
  @PrimaryColumn({ unique: true })
  @Field()
  name: string;

  @OneToMany(() => Course, (course) => course.subject, { eager: true })
  @Field(() => [Course], { nullable: true })
  courses: Course[];
}
