import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppointmentEntity } from "../../domain/entities/appointment.entity";

@Injectable()
export class AppointmentTypeOrmRepository implements AppointmentRepository {
    constructor(
        @InjectRepository(AppointmentEntity)
        private appointmentRepository: Repository<AppointmentEntity>,
    ) { }

    async createAppointment(appointmentEntity: Partial<AppointmentEntity>): Promise<AppointmentEntity | null> {
        try {
            return await this.appointmentRepository.save(appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentEntity>): Promise<any> {
        try {
            return await this.appointmentRepository.update(idAppointment, appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}