import { Inject, Injectable } from "@nestjs/common";
import { CreateAppointmentDto } from "../domain/dto/create-appointment.dto";
import { AppointmentDynamoItem } from "../domain/entities/appointment-dynamo-item";
import { ulid } from "ulid";
import { SnsService } from "src/shared/aws/sns.service";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";

@Injectable()
export class UpdateAppoitmentUseCase {

    private readonly topicArn = process.env.SNS_TOPIC_ARN!;


    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
        private readonly snsService: SnsService,

    ) { }

    async updateAppointment(appointmentParams: any): Promise<any> {
        try {
            // return await this.appointmentDynamoRepository.findAll()
            const { appointmentId, insuredId, countryISO, status, scheduleId } = appointmentParams.detail

            const now = new Date().toISOString();
            return this.appointmentDynamoRepository.updateAppointmentDynamo(insuredId, scheduleId, { status: "CONFIRMED", updatedAt: now });


        } catch (error) {
            throw new Error(error.message)
        }
    }
}