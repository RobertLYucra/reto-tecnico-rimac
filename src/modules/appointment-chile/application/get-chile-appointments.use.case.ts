import { Inject, Injectable } from "@nestjs/common";
import { ClAppointmentRepository } from "../domain/repository/cl-appointment.repository";


@Injectable()
export class GetClTopicAppoitmentUseCase {

    constructor(
        @Inject('ClAppointmentRepository')
        private readonly appointmentRepository: ClAppointmentRepository,
    ) { }

    async getChileTopicAppointmentById(scheduleId: number) {
        return this.appointmentRepository.getScheduledById(scheduleId)
    }
}