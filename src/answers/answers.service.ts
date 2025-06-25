import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Game } from 'src/game/entities/game.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
  ) {}

  async createEmptyAnswer(game: Game, question: any): Promise<Answer> {
    const answer = new Answer();
    answer.question = question;
    answer.game = game;
    return await this.answersRepository.save(answer);
  }

  async saveAnswer(answer: Answer): Promise<Answer> {
    return await this.answersRepository.save(answer);
  }

  async getBestAnswer(game: Game): Promise<Answer | null> {
    return await this.answersRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .where('answer.game_id = :gameId', { gameId: game.id })
      .andWhere('answer.is_correct = :isCorrect', { isCorrect: true })
      .orderBy(
        'TIMESTAMPDIFF(SECOND, answer.created_at, answer.updated_at)',
        'ASC',
      )
      .getOne();
  }
}
