import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveAnswerDto {
  @IsNumber()
  @IsOptional()
  answer?: number;

  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;

  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  game_id: string;
}
