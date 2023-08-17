import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('*/20 * * * * *')
  handleCron() {
    this.logger.log('Called 20s/次');
  }
}
