import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('api/assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('chat')
  async chat(@Body('message') message: string): Promise<{ response: string }> {
    return this.assistantService.handleParentMessage(message);
  }
}
