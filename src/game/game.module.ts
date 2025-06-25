import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [QuestionsModule, AnswersModule, TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
