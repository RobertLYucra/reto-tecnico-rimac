import { AppointmentChileEntity } from "../entities/appointment-chile.entity"
import { ScheduleChileEntity } from "../entities/scheduled-chile.entity"

export interface ClAppointmentRepository {
    createAppointment(appointmentEntity: Partial<AppointmentChileEntity>): Promise<AppointmentChileEntity | null>
    updateAppointment(idAppointment: number, appointmentEntity: Partial<AppointmentChileEntity>): Promise<any>
    getScheduledById(scheduleId: number): Promise<ScheduleChileEntity | null>
}