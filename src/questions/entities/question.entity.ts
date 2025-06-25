import { Answer } from 'src/answers/entities/answer.entity';
import { Base } from 'src/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Question extends Base {
  @Column()
  equation: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  correct_answer: number;

  @Column()
  difficulty: number;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
