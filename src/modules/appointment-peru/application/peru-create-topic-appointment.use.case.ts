import { Inject, Injectable } from "@nestjs/common";
import { PeAppointmentRepository } from "../domain/repository/pe-appointment.repository";
import { AppointmentPeruEntity } from "../domain/entities/appointment-peru.entity";
import { EventBridgeService } from "src/shared/aws/brigde.service";
import { AppointmentEventDto } from "../domain/dto/create-appointment.dto";

@Injectable()
export class PeCreateTopicAppoitmentUseCase {


    constructor(
        @Inject('PeAppointmentRepository')
        private readonly appointmentRepository: PeAppointmentRepository,
        private readonly bridgeService: EventBridgeService,
    ) { }

    async peruTopicAppointment(data: AppointmentEventDto) {
        try {
            
            const appointment: Partial<AppointmentPeruEntity> = {
                countryIso: data.countryISO,
                appointmentId: data.appointmentId,
                insuredId: data.insuredId,
                scheduleId: data.scheduleId,
                deleted: false,
                status : "COMPLETED"
            }

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