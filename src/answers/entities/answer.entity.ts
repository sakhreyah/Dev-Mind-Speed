import { Transform } from 'class-transformer';
import { Base } from 'src/base/base.entity';
import { Game } from 'src/game/entities/game.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Answer extends Base {
  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Game, (game) => game.answers)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column({ type: 'int', nullable: true })
  answer: number | null;

  @Column({
    type: 'tinyint',
    nullable: true,
    transformer: {
      to: (value: boolean | null) => (value === null ? null : value ? 1 : 0),
      from: (value: number | null) => (value === null ? null : value === 1),
    },
  })
  is_correct: boolean | null;
}
