import { Injectable } from "@nestjs/common";
import { SqsService } from "src/shared/aws/sqs.service";

@Injectable()
export class TopicAppoitmentUseCase {
    constructor(
        private readonly sqsService: SqsService
    ) { }

    async topicAppointment(snsMessage: any) {
        try {

            const { countryISO } = snsMessage.data;

            console.log("ccountryISO:", countryISO)

            // Definir la cola según el país
            let queueName = '';
            switch (countryISO.toUpperCase()) {
                case 'PE':
                    queueName = 'rimac-api-appointment-queue-peru';
                    break;
                case 'CL':
                    queueName = 'rimac-api-appointment-queue-chile';
                    break;
                default:
                    throw new Error(`País no soportado: ${countryISO}`);
            }

            await this.sqsService.sendMessage(snsMessage, queueName);
            console.log(`Mensaje enviado a la cola ${queueName}`);

        } catch (error) {
            throw new Error(`Error al enviar mensajes a la cosa: ${error.message}`)
        }
    }
}