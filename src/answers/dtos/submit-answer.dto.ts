import { IsNumber, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'The answer to the math question',
    example: 42,
  })
  @Transform(({ value }) => {
    const num = Number(value);
    return Math.round(num * 100) / 100;
  })
  @IsNumber()
  @IsDefined()
  answer: number;
}
