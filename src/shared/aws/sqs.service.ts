import { Injectable } from '@nestjs/common';
import { GetQueueUrlCommand, SQSClient, SendMessageBatchCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import { APP_REGION } from '../constants/connection.constant';

@Injectable()
export class SqsService {
    private sqs = new SQSClient({ region: APP_REGION });
    private queueUrls = new Map<string, string>();

    private async getQueueUrl(queueName: string): Promise<string> {
        if (!this.queueUrls.has(queueName)) {
            const { QueueUrl } = await this.sqs.send(new GetQueueUrlCommand({ QueueName: queueName }));
            if (!QueueUrl) throw new Error(`No se pudo obtener QueueUrl para ${queueName}`);
            this.queueUrls.set(queueName, QueueUrl);
        }
        return this.queueUrls.get(queueName)!;
    }

    async sendMessage(messageBody: any, queueName: string): Promise<void> {

        console.log(APP_REGION)

        const QueueUrl = await this.getQueueUrl(queueName);

        console.log(QueueUrl)

        await this.sqs.send(new SendMessageCommand({
            QueueUrl,
            MessageBody: JSON.stringify(messageBody),
        }));
    }
}
