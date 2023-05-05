import { Injectable } from '@nestjs/common';
import { authPostRequest, ethGoerli,  } from './omnia';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const url = await ethGoerli();
    return {url :url.http};
  }
}
