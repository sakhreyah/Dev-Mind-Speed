import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from 'src/answers/answers.service';
import { SubmitAnswerDto } from 'src/answers/dtos/submit-answer.dto';
import { Answer } from 'src/answers/entities/answer.entity';
import { Base } from 'src/base/base.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { IsNull, Repository } from 'typeorm';
import { EndGameResponseDto } from './dtos/end-game-response.dto';
import { StartGameResponseDto } from './dtos/start-game-response.dto';
import { StartGameDto } from './dtos/start-game.dto';
import { SubmitAnswerResponseDto } from './dtos/submit-answer-response.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private configService: ConfigService,
  ) {}

  private getBaseUrl(): string {
    const port = this.configService.get<number>('PORT', 3000);
    return `http://localhost:${port}/api/v1`;
  }

  async getGame(id: string): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { id },
      relations: ['answers.question'],
    });
  }

  getSecondsSpent(base: Base): number {
    return Math.floor(
      (base.updated_at.getTime() - base.created_at.getTime()) / 1000,
    );
  }

  async getScore(game: Game): Promise<string> {
    const gameEntity = await this.getGame(game.id);

    if (!gameEntity) {
      throw new NotFoundException('Game not found');
    }

    if (gameEntity.answers.length === 0) {
      return '0/0';
    }

    const correctAnswers = gameEntity.answers.filter(
      (answer) => answer.is_correct === true,
    ).length;

    const allAnswersCount = gameEntity.answers.length - 1;

    return `${correctAnswers}/${allAnswersCount}`;
  }

  async startGame(startGameDto: StartGameDto): Promise<StartGameResponseDto> {
    const game = this.gameRepository.create(startGameDto);
    const savedGame = await this.gameRepository.save(game);

    const generatedQuestion = await this.questionsService.generateQuestion(
      savedGame.difficulty,
    );

    await this.answersService.createEmptyAnswer(savedGame, generatedQuestion);

    return {
      message: `Hello ${savedGame.name},find your submit API URL below.`,
      submit_url: `${this.getBaseUrl()}/game/${savedGame.id}/submit`,
      question: generatedQuestion.equation,
      time_started: generatedQuestion.created_at,
    };
  }

  async submitAnswer(
    gameId: string,
    submitAnswerDto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId, answers: { answer: IsNull() } },
      relations: ['answers.question'],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (this.getSecondsSpent(game) !== 0) {
      throw new BadRequestException('Game ended');
    }

    const unansweredQuestion = game.answers.find(
      (answer) => answer.answer === null,
    );

    if (!unansweredQuestion) {
      throw new NotFoundException('Unanswered question not found');
    }

    if (!unansweredQuestion?.question) {
      throw new NotFoundException('Unanswered question not found');
    }

    const isCorrect =
      unansweredQuestion.question.correct_answer === submitAnswerDto.answer;

    unansweredQuestion.answer = submitAnswerDto.answer;
    unansweredQuestion.is_correct = isCorrect;

    const updatedAnswer =
      await this.answersService.saveAnswer(unansweredQuestion);

    const newQuestion = await this.questionsService.generateQuestion(
      game.difficulty,
    );

    await this.answersService.createEmptyAnswer(game, newQuestion);

    return {
      result: isCorrect
        ? `Good job ${game.name}, your answer is correct!`
        : `Sorry ${game.name}, your answer is incorrect!`,
      time_taken: this.getSecondsSpent(updatedAnswer),
      next_question: {
        submit_url: `${this.getBaseUrl()}/game/${game.id}/submit`,
        question: newQuestion.equation,
      },
      current_score: await this.getScore(game),
    };
  }

  async endGame(gameId: string): Promise<EndGameResponseDto> {
    const game = await this.getGame(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const bestAnswer = await this.answersService.getBestAnswer(game);

    game.updated_at = new Date();
    const updatedGame = await this.gameRepository.save(game);

    return {
      name: game.name,
      difficulty: game.difficulty,
      current_score: await this.getScore(game),
      total_time_spent: this.getSecondsSpent(updatedGame),
      best_score: bestAnswer
        ? {
            question: bestAnswer.question.equation,
            answer: bestAnswer.answer,
            time_taken: this.getSecondsSpent(bestAnswer),
          }
        : null,
      history: game.answers
        .filter((answer) => answer.answer !== null)
        .map((answer) => ({
          question: answer.question.equation,
          answer: answer.answer,
          time_taken: this.getSecondsSpent(answer),
        })),
    };
  }
}
