import { Inject, Injectable } from "@nestjs/common";
import { CreateAppointmentDto } from "../domain/dto/create-appointment.dto";
import { AppointmentRepository } from "../domain/repositories/appointment.repository";

@Injectable()
export class CreateAppoitmentUseCase {
    constructor(
        @Inject('AppointmentRepository')
        private readonly appointmentRepository: AppointmentRepository,
    ) { }

    async createAppointment(appointmentParams: CreateAppointmentDto): Promise<any> {
        try {


        } catch (error) {
            throw new Error(error.message)
        }
    }
}