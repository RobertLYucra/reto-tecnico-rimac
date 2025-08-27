import { Inject, Injectable } from "@nestjs/common";
import { CreateAppointmentDto } from "../domain/dto/create-appointment.dto";
import { AppointmentDynamoItem } from "../domain/entities/appointment-dynamo-item";
import { ulid } from "ulid";
import { SnsService } from "src/shared/aws/sns.service";
import { AppointmentDynamoRepository } from "../domain/repositories/appointment-dynamo.repository";
import { SNS_TOPIC_ARN } from "src/shared/constants/connection.constant";
import { GetPeTopicAppoitmentUseCase } from "src/modules/appointment-peru/application/get-peru-appointments.use.case";
import { AppointmentResponseDto } from "../domain/dto/response/appointment.response.dto";
import { AppointmentMapping as AppointmentMapping } from "./mapping/appointment.mapping";
import { GetClTopicAppoitmentUseCase } from "src/modules/appointment-chile/application/get-chile-appointments.use.case";

@Injectable()
export class CreateAppoitmentUseCase {

    private readonly topicArn = SNS_TOPIC_ARN ?? process.env.SNS_TOPIC_ARN!;


    constructor(
        @Inject('AppointmentDynamoRepository')
        private readonly appointmentDynamoRepository: AppointmentDynamoRepository,
        private readonly snsService: SnsService,
        private readonly getPeTopicAppoitmentUseCase: GetPeTopicAppoitmentUseCase,
        private readonly getClTopicAppoitmentUseCase: GetClTopicAppoitmentUseCase
    ) { }

    async createAppointment(appointmentParams: CreateAppointmentDto): Promise<AppointmentResponseDto> {
        try {


            const country = (appointmentParams.countryISO || '').toUpperCase();
            if (country !== 'PE' && country !== 'CL') {
                throw new Error('País no soportado (use PE o CL)');
            }

            const scheduleId = Number(appointmentParams.scheduleId);
            if (!Number.isFinite(scheduleId)) {
                throw new Error('scheduleId inválido');
            }

            //Buscamos si la programación con ese Id Existe
            const findSchedule = country === 'PE'
                ? (id: number) => this.getPeTopicAppoitmentUseCase.getPeruTopicAppointmentById(id)
                : (id: number) => this.getClTopicAppoitmentUseCase.getChileTopicAppointmentById(id);
            const scheduleFound = await findSchedule(scheduleId);

            if (!scheduleFound) throw new Error("Programación no existe o fue eliminado")

            const now = new Date().toISOString();

            //Armando la estrucutura de Appointment
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
                centerId: scheduleFound.centerId,
                dateSchedule: scheduleFound.date instanceof Date
                    ? scheduleFound.date.toISOString()
                    : String(scheduleFound.date),
                medicId: scheduleFound.medicId,
                specialtyId: scheduleFound.specialtyId,
                deleted: false
            };

            //Creando appointment en DynamoDb - appoitment
            const appointmentCreated = await this.appointmentDynamoRepository.createAppointmentDynamo(item);
            if (!appointmentCreated) throw new Error("No se pudo crear la Cita")

            //Publicnado en SNS

            await this.snsService.publishAppointmentAccepted({
                appointmentId: appointmentCreated.appointmentId,
                insuredId: appointmentCreated.insuredId,
                scheduleId: appointmentCreated.scheduleId,
                countryISO: appointmentCreated.countryISO,
                status: appointmentCreated.status,
                createdAt: appointmentCreated.createdAt,
                PK: appointmentCreated.PK,
                SK: appointmentCreated.SK
            }, this.topicArn);

            //Armando la estrucutura de Response Appointment
            return AppointmentMapping(appointmentCreated)

        } catch (error) {
            throw new Error(error.message)
        }
    }
}