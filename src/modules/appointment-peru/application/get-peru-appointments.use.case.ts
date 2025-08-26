import { Inject, Injectable } from "@nestjs/common";
import { PeAppointmentRepository } from "../domain/repository/pe-appointment.repository";


@Injectable()
export class GetPeTopicAppoitmentUseCase {

    constructor(
        @Inject('PeAppointmentRepository')
        private readonly appointmentRepository: PeAppointmentRepository,
    ) { }

    async getPeruTopicAppointmentById(scheduleId: number) {
        return this.appointmentRepository.getScheduledById(scheduleId)
    }
}