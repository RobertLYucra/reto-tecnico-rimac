import { Injectable } from "@nestjs/common";
import { ClAppointmentRepository } from "../../domain/repository/cl-appointment.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppointmentChileEntity } from "../../domain/entities/appointment-chile.entity";

@Injectable()
export class ClAppointmentTypeOrmRepository implements ClAppointmentRepository {
    constructor(
        @InjectRepository(AppointmentChileEntity, 'PE')
        private readonly appointmentRepository: Repository<AppointmentChileEntity>,
    ) { }

    async createAppointment(appointmentEntity: Partial<AppointmentChileEntity>): Promise<AppointmentChileEntity | null> {
        try {
            return await this.appointmentRepository.save(appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentChileEntity>): Promise<any> {
        try {
            return await this.appointmentRepository.update(idAppointment, appointmentEntity)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}