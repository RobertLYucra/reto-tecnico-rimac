// src/shared/aws/eventbridge.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

@Injectable()
export class EventBridgeService {
    private readonly logger = new Logger(EventBridgeService.name);
    private readonly client = new EventBridgeClient({
        region: process.env.APP_REGION || 'us-east-2',
    });
    private readonly busName = process.env.EVENT_BUS_NAME || 'default';

    async sendEvent(source: string, busName: string, detail: any) {
        const cmd = new PutEventsCommand({
            Entries: [{
                DetailType: busName,
                Source: source,
                EventBusName: this.busName,
                Detail: JSON.stringify(detail),
            }],
        });

        const res = await this.client.send(cmd);

        // Chequear fallas por entrada
        if (res.FailedEntryCount && res.FailedEntryCount > 0) {
            this.logger.error(`PutEvents failed: ${JSON.stringify(res.Entries)}`);
            throw new Error('PutEvents failed');
        }
        return res;
    }
}
