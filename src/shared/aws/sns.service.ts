// src/shared/aws/sns.service.ts
import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
    private readonly client: SNSClient;
    private readonly region = process.env.APP_REGION || 'us-east-2';

    constructor() {
        this.client = new SNSClient({ region: this.region });
    }

    async publishAppointmentAccepted(payload: {
        appointmentId: string;
        insuredId: string;
        scheduleId: string | number;
        countryISO: 'PE' | 'CL' | string;
        status: string;
        createdAt: string;
        PK: string,
        SK: string
    }, snsArn: string) {
        const message = JSON.stringify({
            event: 'APPOINTMENT_ACCEPTED',
            data: payload,
        });
        const topicArn = snsArn || process.env.SNS_TOPIC_ARN!;
        const cmd = new PublishCommand({
            TopicArn: topicArn,
            Subject: 'Appointment accepted',
            Message: message,
            // Clave para el FilterPolicy en tus suscripciones SNS->SQS
            MessageAttributes: {
                country: {
                    DataType: 'String',
                    StringValue: payload.countryISO, // "PE" o "CL"
                },
            },
        });

        await this.client.send(cmd);
    }
}
