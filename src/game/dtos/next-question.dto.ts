import { ApiProperty } from '@nestjs/swagger';

export class NextQuestionDto {
  @ApiProperty({
    description: 'URL endpoint to submit the answer for the next question',
    example:
      'http://localhost:3000/api/v1/game/123e4567-e89b-12d3-a456-426614174000/submit',
  })
  submit_url: string;

  @ApiProperty({
    description: 'The next math equation to solve',
    example: '15 - 8',
  })
  question: string;
}
