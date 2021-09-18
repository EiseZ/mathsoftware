import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { Course } from "./Course";

@Entity()
@ObjectType()
export class Exercise {
  @PrimaryColumn({ unique: true })
  @Field()
  question: string;

  @ManyToOne(() => Course, (course) => course.exercises, { eager: true })
  @Field(() => Course)
  course: Course;

  @Column()
  @Field()
  type: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  multipleChoiceAwnser1?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  multipleChoiceAwnser2?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  multipleChoiceAwnser3?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  multipleChoiceAwnser4?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  multipleChoiceAwnser5?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  openAwnser?: string;
}
