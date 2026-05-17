import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { chatWithParent } from './agent';

@Injectable()
export class AssistantService {
  async handleParentMessage(message: string): Promise<{ response: string }> {
    try {
      const response = await chatWithParent(message);
      return { response };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while processing the message.');
    }
  }
}
