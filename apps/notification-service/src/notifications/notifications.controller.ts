import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @EventPattern(MSG.NOTIFY_SEND)
  handleNotification(@Payload() dto: Parameters<typeof this.notificationsService.handleNotification>[0]) {
    return this.notificationsService.handleNotification(dto);
  }
}