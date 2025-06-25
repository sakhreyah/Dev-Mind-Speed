import { ApiProperty } from '@nestjs/swagger';

export class BestScoreDto {
  @ApiProperty({
    description: 'The math equation of the question answered fastest',
    example: '9 × 4',
  })
  question: string;

  @ApiProperty({
    description: 'The answer provided for the fastest question',
    example: 36,
    nullable: true,
  })
  answer: number | null;

  @ApiProperty({
    description: 'Time taken to answer the fastest question in seconds',
    example: 2,
  })
  time_taken: number;
}
