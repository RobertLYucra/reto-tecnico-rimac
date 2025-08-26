import { AppointmentPeruEntity} from "../entities/appointment-peru.entity";

export interface PeAppointmentRepository {
    createAppointment(appointmentEntity: Partial<AppointmentPeruEntity>): Promise<AppointmentPeruEntity | null>
    updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentPeruEntity>): Promise<any>
}