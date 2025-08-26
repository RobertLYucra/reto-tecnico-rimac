import { Inject, Injectable } from "@nestjs/common";
import { SqsService } from "src/shared/aws/sqs.service";
import { AppointmentRepository } from "../domain/repositories/appointment.repository";
import { AppointmentEntity } from "../domain/entities/appointment.entity";

@Injectable()
export class PeruTopicAppoitmentUseCase {
    constructor(
        private readonly sqsService: SqsService,
        @Inject('AppointmentRepository')
        private readonly appointmentRepository: AppointmentRepository,
    ) { }

    async peruTopicAppointment(event: any) {
        try {

            const { data } = event;

            const appointment: Partial<AppointmentEntity> = {
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