import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiDescription(): string {
    return 'Dev Mind Speed Game API';
  }
}
