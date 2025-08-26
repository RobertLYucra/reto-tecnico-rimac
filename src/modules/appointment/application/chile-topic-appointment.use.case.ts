import { Injectable } from "@nestjs/common";
import { SqsService } from "src/shared/aws/sqs.service";

@Injectable()
export class ChileTopicAppoitmentUseCase {
    constructor(
        private readonly sqsService: SqsService
    ) { }

    async peruTopicAppointment(event: any) {
        try {

            const { event: eventName, data } = event;

        } catch (error) {
            throw new Error(error.message)
        }
    }
}