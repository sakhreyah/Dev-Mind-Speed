import { ApiProperty } from '@nestjs/swagger';

export class QuestionHistoryDto {
  @ApiProperty({
    description: 'The math equation that was answered',
    example: '25 ÷ 5',
  })
  question: string;

  @ApiProperty({
    description: 'The answer provided by the player',
    example: 5,
    nullable: true,
  })
  answer: number | null;

  @ApiProperty({
    description: 'Time taken to answer this question in seconds',
    example: 4,
  })
  time_taken: number;
}
