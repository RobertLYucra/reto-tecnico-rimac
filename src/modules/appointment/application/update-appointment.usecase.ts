import { Inject, Injectable } from "@nestjs/common";
import { SnsService } from "src/shared/aws/sns.service";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";

@Injectable()
export class UpdateAppoitmentUseCase {

    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
        private readonly snsService: SnsService,

    ) { }

    async updateAppointment(appointmentParams: any): Promise<void> {
        try {

            console.log("Event: ", appointmentParams)

            const { appointmentId, insuredId, countryISO, status, scheduleId } = appointmentParams.detail

            const now = new Date().toISOString();

            await this.appointmentDynamoRepository.updateStatusByAppointmentId(
                appointmentId,
                (status || '').toUpperCase() === 'COMPLETED' ? 'CONFIRMED' : status.toUpperCase(), now);

        } catch (error) {
            throw new Error(error.message)
        }
    }
}