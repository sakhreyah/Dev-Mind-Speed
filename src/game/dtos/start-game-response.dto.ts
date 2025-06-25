import { ApiProperty } from '@nestjs/swagger';

export class StartGameResponseDto {
  @ApiProperty({
    description: 'Welcome message with player name and instructions',
    example: 'Hello Musab Sakhreyah,find your submit API URL below.',
  })
  message: string;

  @ApiProperty({
    description: 'URL endpoint to submit answers for this game session',
    example:
      'http://localhost:3000/api/v1/game/123e4567-e89b-12d3-a456-426614174000/submit',
  })
  submit_url: string;

  @ApiProperty({
    description: 'The first math equation to solve',
    example: '7 + 3',
  })
  question: string;

  @ApiProperty({
    description: 'Timestamp when the game session was started',
    example: '2025-06-25T09:30:15.123Z',
  })
  time_started: Date;
}
