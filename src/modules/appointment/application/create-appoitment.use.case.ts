import { Inject, Injectable } from "@nestjs/common";
import { CreateAppointmentDto } from "../domain/dto/create-appointment.dto";
import { AppointmentDynamoItem } from "../domain/entities/appointment-dynamo-item";
import { ulid } from "ulid";
import { SnsService } from "src/shared/aws/sns.service";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";
import { SNS_TOPIC_ARN } from "src/shared/constants/connection.constant";

@Injectable()
export class CreateAppoitmentUseCase {

    private readonly topicArn = SNS_TOPIC_ARN ?? process.env.SNS_TOPIC_ARN!;


    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
        private readonly snsService: SnsService,

    ) { }

    async createAppointment(appointmentParams: CreateAppointmentDto): Promise<any> {
        try {
            // return await this.appointmentDynamoRepository.findAll()
            const now = new Date().toISOString();

            const item: AppointmentDynamoItem = {
                PK: `INSURED#${appointmentParams.insuredId}`,
                SK: `APPT#${appointmentParams.scheduleId}`,
                appointmentId: ulid(),
                insuredId: appointmentParams.insuredId,
                scheduleId: appointmentParams.scheduleId,
                countryISO: appointmentParams.countryISO,
                status: 'PENDING',
                createdAt: now,
                updatedAt: now,
            };


            const appointmentCreated = await this.appointmentDynamoRepository.createAppointmentDynamo(item);
            if (!appointmentCreated) throw new Error("No se pudo crear la Cita")


            await this.snsService.publishAppointmentAccepted({
                appointmentId: appointmentCreated.appointmentId,
                insuredId: appointmentCreated.insuredId,
                scheduleId: appointmentCreated.scheduleId,
                countryISO: appointmentCreated.countryISO,
                status: appointmentCreated.status,
                createdAt: appointmentCreated.createdAt,
                
            }, this.topicArn);

            return {
                message: 'Appointment accepted and is being processed',
                id: appointmentCreated.appointmentId,
                insuredId: appointmentCreated.insuredId,
                scheduleId: appointmentCreated.scheduleId,
                status: appointmentCreated.status,
                createdAt: appointmentCreated.createdAt,
            };

        } catch (error) {
            throw new Error(error.message)
        }
    }
}