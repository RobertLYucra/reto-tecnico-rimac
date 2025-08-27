import { Inject, Injectable } from "@nestjs/common";
import { ClAppointmentRepository } from "../domain/repository/cl-appointment.repository";
import { AppointmentChileEntity } from "../domain/entities/appointment-chile.entity";
import { EventBridgeService } from "src/shared/aws/brigde.service";
import { AppointmentEventDto } from "../domain/dto/create-appointment.dto";

@Injectable()
export class ClCreateTopicAppoitmentUseCase {
    constructor(
        @Inject('ClAppointmentRepository')
        private readonly appointmentRepository: ClAppointmentRepository,
        private readonly bridgeService : EventBridgeService
    ) { }

    async chileTopicAppointment(data: AppointmentEventDto) {
        try {
            const appointment: Partial<AppointmentChileEntity> = {
                countryIso: data.countryISO,
                appointmentId: data.appointmentId,
                insuredId: data.insuredId,
                scheduleId: data.scheduleId,
                deleted: false,
                status : "COMPLETED"
            }

            //Appoitmentent creado en la base de datps de Chile
            const appointmentCreated = await this.appointmentRepository.createAppointment(appointment)
            if (!appointmentCreated) {
                console.log("Error al Agendar Cita")
                return;
            }

            //Enviando Event Bridge
            await this.bridgeService.sendEvent("appointment.completed", "AppointmentCompleted", {
                id: appointmentCreated.id,
                appointmentId: data.appointmentId,
                insuredId: data.insuredId,
                countryISO: data.countryISO,
                status: 'COMPLETED',
                timestamp: new Date().toISOString(),
                scheduleId: appointmentCreated.scheduleId,
            })

            console.log("Evento enviado a EventBridge");

            return;

        } catch (error) {
            throw new Error(error.message)
        }
    }
}