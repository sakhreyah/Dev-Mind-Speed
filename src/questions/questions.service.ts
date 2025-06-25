import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { evaluate } from 'mathjs';
import { faker } from '@faker-js/faker';
import { sample, times, shuffle } from 'lodash';
import { Random } from 'random-js';

@Injectable()
export class QuestionsService {
  private readonly random = new Random(); // Advanced random generator

  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {} /**
   * Generates a math question based on difficulty level
   * @param difficulty - Level 1-4, higher = more complex
   * @returns Promise<Question> - Saved question entity
   */
  async generateQuestion(difficulty: number): Promise<Question> {
    // Step 1: Get difficulty settings
    const settings = this.getDifficultySettings(difficulty);

    // Step 2: Generate random numbers
    const numbers = this.generateRandomNumbers(
      settings.operandCount,
      settings.digitLength,
    );

    // Step 3: Generate random operations
    const operations = this.generateRandomOperations(settings.operandCount - 1);

    // Step 4: Build question text (e.g., "5 + 3 * 2")
    const questionText = this.buildQuestionText(numbers, operations);

    // Step 5: Calculate answer using mathjs (handles order of operations automatically!)
    const answer = Math.round((evaluate(questionText) as number) * 100) / 100;

    // Step 6: Save to database and return
    return this.saveQuestion(questionText, answer, difficulty);
  }

  /**
   * Returns settings for each difficulty level
   */
  private getDifficultySettings(difficulty: number) {
    const settings = {
      1: { operandCount: 2, digitLength: 1 }, // 2 numbers, 1 digit each (e.g., 5 + 3)
      2: { operandCount: 3, digitLength: 2 }, // 3 numbers, 2 digits each (e.g., 12 + 34 - 56)
      3: { operandCount: 4, digitLength: 3 }, // 4 numbers, 3 digits each
      4: { operandCount: 5, digitLength: 4 }, // 5 numbers, 4 digits each
    };

    return settings[difficulty] || settings[1]; // Default to level 1 if invalid
  } /**
   * Generates array of random numbers using multiple advanced libraries
   */
  private generateRandomNumbers(count: number, digitLength: number): number[] {
    return times(count, () => {
      const min = Math.pow(10, digitLength - 1);
      const max = Math.pow(10, digitLength) - 1;

      // Use faker for variety and random-js for precision
      return this.random.bool()
        ? faker.number.int({ min, max })
        : this.random.integer(min, max);
    });
  }

  /**
   * Advanced random operations with weighted selection
   * Higher difficulties favor more complex operations
   */
  private generateRandomOperations(count: number): string[] {
    // Create weighted operations (addition/subtraction more common for beginners)
    const weightedOps = [
      '+',
      '+',
      '+', // 3x weight for addition
      '-',
      '-', // 2x weight for subtraction
      '*', // 1x weight for multiplication
      '/', // 1x weight for division
    ];

    return times(count, () => {
      // Use lodash sample for random selection from weighted array
      return sample(shuffle(weightedOps))!;
    });
  }
  /**
   * Builds question text with smart division-by-zero prevention
   * Uses lodash for array manipulation and faker for fallback numbers
   */
  private buildQuestionText(numbers: number[], operations: string[]): string {
    let question = numbers[0].toString();

    for (let i = 0; i < operations.length; i++) {
      let nextNumber = numbers[i + 1];

      // Smart division by zero prevention using faker as fallback
      if (operations[i] === '/' && nextNumber === 0) {
        nextNumber = faker.number.int({ min: 1, max: 9 }); // Generate safe divisor
      }

      question += ` ${operations[i]} ${nextNumber}`;
    }

    return question;
  }

  /**
   * Saves the question to database
   */
  private async saveQuestion(
    questionText: string,
    answer: number,
    difficulty: number,
  ): Promise<Question> {
    const questionEntity = this.questionsRepository.create({
      equation: questionText,
      correct_answer: answer,
      difficulty: difficulty,
    });

    return await this.questionsRepository.save(questionEntity);
  }

  /**
   * Demo method showing all the powerful libraries we're using
   */
  async generateSampleQuestions(): Promise<Question[]> {
    const samples: Question[] = [];

    for (let difficulty = 1; difficulty <= 4; difficulty++) {
      const question = await this.generateQuestion(difficulty);
      samples.push(question);
    }

    return samples;
  }
}
