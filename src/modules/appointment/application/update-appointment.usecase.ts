import { Inject, Injectable } from "@nestjs/common";
import { SnsService } from "src/shared/aws/sns.service";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";
import { AppointmentUpdateEvent } from "../domain/dto/update-appointment.dto";

@Injectable()
export class UpdateAppoitmentUseCase {

    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
        private readonly snsService: SnsService,

    ) { }

    async updateAppointment(appointmentParams: AppointmentUpdateEvent): Promise<void> {
        try {

            console.log("Event: ", appointmentParams)

            const { appointmentId, insuredId, countryISO, status, scheduleId } = appointmentParams

            const now = new Date().toISOString();

            await this.appointmentDynamoRepository.updateStatusByAppointmentId(
                appointmentId,
                (status || '').toUpperCase() === 'COMPLETED' ? 'COMPLETED' : status.toUpperCase(), now);

        } catch (error) {
            throw new Error(error.message)
        }
    }
}