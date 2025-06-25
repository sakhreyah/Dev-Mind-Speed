import { ApiProperty } from '@nestjs/swagger';
import { BestScoreDto } from './best-score.dto';
import { QuestionHistoryDto } from './question-history.dto';

export class EndGameResponseDto {
  @ApiProperty({
    description: 'Name of the player who completed the game',
    example: 'Musab Sakhreyah',
  })
  name: string;

  @ApiProperty({
    description: 'Difficulty level of the completed game (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  difficulty: number;

  @ApiProperty({
    description:
      'Final score showing correct answers out of total questions answered',
    example: '8/10',
  })
  current_score: string;

  @ApiProperty({
    description: 'Total time spent playing the game in seconds',
    example: 45,
  })
  total_time_spent: number;

  @ApiProperty({
    description:
      'Details of the question answered in the shortest time, null if no questions were answered',
    type: BestScoreDto,
    nullable: true,
  })
  best_score: BestScoreDto | null;

  @ApiProperty({
    description:
      'Complete history of all questions answered during the game session',
    type: [QuestionHistoryDto],
    example: [
      {
        question: '7 + 3',
        answer: 10,
        time_taken: 3,
      },
      {
        question: '15 - 8',
        answer: 7,
        time_taken: 4,
      },
      {
        question: '9 × 4',
        answer: 36,
        time_taken: 2,
      },
    ],
  })
  history: QuestionHistoryDto[];
}
