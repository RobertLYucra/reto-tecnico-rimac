import { Inject, Injectable } from "@nestjs/common";
import { ClAppointmentRepository } from "../domain/repository/cl-appointment.repository";
import { AppointmentChileEntity } from "../domain/entities/appointment-chile.entity";

@Injectable()
export class ClCreateTopicAppoitmentUseCase {
    constructor(
        @Inject('PeAppointmentRepository')
        private readonly appointmentRepository: ClAppointmentRepository,
    ) { }

    async chileTopicAppointment(event: any) {
        try {

            const { data } = event;
            const appointment: Partial<AppointmentChileEntity> = {
                countryIso: data.countryISO,
                appointmentId: data.appointmentId,
                insuredId: data.insuredId,
                scheduleId: data.scheduleId,
                deleted: false,
            }

            const appointmentCreated = await this.appointmentRepository.createAppointment(appointment)
            if (!appointmentCreated) {
                console.log("Error al crear Cita")
                return;
            }

            console.log("Cita: ", appointment)

        } catch (error) {
            throw new Error(error.message)
        }
    }
}