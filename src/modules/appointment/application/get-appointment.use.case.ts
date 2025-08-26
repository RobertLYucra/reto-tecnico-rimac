import { Inject, Injectable } from "@nestjs/common";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";
import { AppointmentResponseDto } from "../domain/dto/response/appointment.response.dto";
import { AppointmentMapping } from "./mapping/appointment.mapping";

@Injectable()
export class GetAppointmentUseCase {

    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
    ) { }

    async getAppointById(idAppointment: string): Promise<AppointmentResponseDto> {
        try {
            const appointmentFound = await this.appointmentDynamoRepository.getAppointmentById(idAppointment)
            if (!appointmentFound) throw new Error("Cita no encontrado")

            return AppointmentMapping(appointmentFound)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
