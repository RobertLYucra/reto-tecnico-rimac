import { AppointmentEntity } from "../entities/appointment.entity";

export interface AppointmentRepository {
    createAppointment(appointmentEntity: Partial<AppointmentEntity>): Promise<AppointmentEntity | null>
    updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentEntity>): Promise<any>
}