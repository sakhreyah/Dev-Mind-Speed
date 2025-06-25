import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubmitAnswerDto } from 'src/answers/dtos/submit-answer.dto';
import { EndGameResponseDto } from './dtos/end-game-response.dto';
import { StartGameResponseDto } from './dtos/start-game-response.dto';
import { StartGameDto } from './dtos/start-game.dto';
import { SubmitAnswerResponseDto } from './dtos/submit-answer-response.dto';
import { GameService } from './game.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  @ApiOperation({
    summary: 'Start a new game',
    description:
      'Creates a new math game session with the specified difficulty level for the player.',
  })
  @ApiBody({
    description: 'Game configuration',
    type: StartGameDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Game session created successfully. Returns welcome message, submit URL, first question, and start time.',
    type: StartGameResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  startGame(@Body() startGameDto: StartGameDto): Promise<StartGameResponseDto> {
    return this.gameService.startGame(startGameDto);
  }

  @Post(':id/submit')
  @ApiOperation({
    summary: 'Submit an answer',
    description:
      'Submit an answer for the current question in the game session. Returns feedback and the next question.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique game session identifier (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Answer submission',
    type: SubmitAnswerDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Answer processed successfully. Returns result feedback, time taken, next question, and current score.',
    type: SubmitAnswerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid answer format',
  })
  @ApiResponse({
    status: 404,
    description: 'Game session not found',
  })
  submitAnswer(
    @Param('id') id: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> {
    return this.gameService.submitAnswer(id, submitAnswerDto);
  }

  @Get(':id/end')
  @ApiOperation({
    summary: 'End the game',
    description:
      'End the current game session and retrieve comprehensive results including final score, total time, fastest answer, and complete question history.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique game session identifier (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description:
      'Game ended successfully. Returns complete game statistics including final score, total time, best performance, and full question history.',
    type: EndGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game session not found',
  })
  endGame(@Param('id') id: string): Promise<EndGameResponseDto> {
    return this.gameService.endGame(id);
  }
}
