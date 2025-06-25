import { ApiProperty } from '@nestjs/swagger';
import { NextQuestionDto } from './next-question.dto';

export class SubmitAnswerResponseDto {
  @ApiProperty({
    description:
      'Personalized feedback message indicating if the answer was correct or incorrect',
    example: 'Good job Musab Sakhreyah, your answer is correct!',
  })
  result: string;

  @ApiProperty({
    description: 'Time taken to answer the question in seconds',
    example: 3,
  })
  time_taken: number;

  @ApiProperty({
    description: 'Details about the next question to solve',
    type: NextQuestionDto,
  })
  next_question: NextQuestionDto;

  @ApiProperty({
    description:
      'Current score showing correct answers out of total answered questions',
    example: '5/7',
  })
  current_score: string;
}
