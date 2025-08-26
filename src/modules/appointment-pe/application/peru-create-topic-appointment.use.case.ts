import { Inject, Injectable } from "@nestjs/common";
import { PeAppointmentRepository } from "../domain/repository/pe-appointment.repository";
import { AppointmentPeruEntity } from "../domain/entities/appointment-peru.entity";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { scheduled } from "rxjs";

@Injectable()
export class PeCreateTopicAppoitmentUseCase {

    private readonly ebClient = new EventBridgeClient({ region: process.env.APP_REGION });

    constructor(
        @Inject('PeAppointmentRepository')
        private readonly appointmentRepository: PeAppointmentRepository,
    ) { }

    async peruTopicAppointment(event: any) {
        try {

            const { data } = event;
            const appointment: Partial<AppointmentPeruEntity> = {
                countryIso: data.countryISO,
                appointmentId: data.appointmentId,
                insuredId: data.insuredId,
                scheduleId: data.scheduleId,
                deleted: false,
            }

            const appointmentCreated = await this.appointmentRepository.createAppointment(appointment)
            if (!appointmentCreated) {
                console.log("Error al Agendar Cita")
                return;
            }

            //Enviando Event Bridge
            await this.ebClient.send(new PutEventsCommand({
                Entries: [{
                    DetailType: 'AppointmentCompleted',
                    Source: 'appointment.completed',
                    EventBusName: process.env.EVENT_BUS_NAME,
                    Detail: JSON.stringify({
                        appointmentId: data.appointmentId,
                        insuredId: data.insuredId,
                        countryISO: data.countryISO,
                        status: 'completed',
                        timestamp: new Date().toISOString(),
                        scheduleId: appointmentCreated.scheduleId
                    }),
                }]
            }));

            console.log("Evento enviado a EventBridge");

            return;

        } catch (error) {
            throw new Error(error.message)
        }
    }
}