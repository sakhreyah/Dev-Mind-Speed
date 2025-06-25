import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartGameDto {
  @ApiProperty({
    description: 'The player name',
    example: 'Musab Sakhreyah',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The game difficulty level (1-4)',
    example: 1,
    minimum: 1,
    maximum: 4,
  })
  @IsInt()
  @IsDefined()
  @Min(1)
  @Max(4)
  difficulty: number;
}
