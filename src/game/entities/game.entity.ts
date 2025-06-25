import { Answer } from 'src/answers/entities/answer.entity';
import { Base } from 'src/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Game extends Base {
  @Column()
  name: string;

  @Column()
  difficulty: number;

  @OneToMany(() => Answer, (answer) => answer.game)
  answers: Answer[];
}
