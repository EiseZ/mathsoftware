import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

import { Subject } from "./Subject";
import { Exercise } from "./Exercise";

@Entity()
@ObjectType()
export class Course {
  @PrimaryColumn({ unique: true })
  @Field()
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  @Field(() => Subject, { nullable: true })
  subject: Subject;

  @OneToMany(() => Exercise, (exercise) => exercise.course)
  @Field(() => [Exercise])
  exercises: [Exercise];
}
