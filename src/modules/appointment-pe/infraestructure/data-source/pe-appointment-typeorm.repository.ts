import { Injectable } from "@nestjs/common";
import { PeAppointmentRepository } from "../../domain/repository/pe-appointment.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppointmentPeruEntity } from "../../domain/entities/appointment-peru.entity";

@Injectable()
export class PeAppointmentTypeOrmRepository implements PeAppointmentRepository {
    constructor(
        @InjectRepository(AppointmentPeruEntity, 'PE')
        private readonly appointmentRepository: Repository<AppointmentPeruEntity>,
    ) { }

    async createAppointment(appointmentEntity: Partial<AppointmentPeruEntity>): Promise<AppointmentPeruEntity | null> {
        try {
            return await this.appointmentRepository.save(appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentPeruEntity>): Promise<any> {
        try {
            return await this.appointmentRepository.update(idAppointment, appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}