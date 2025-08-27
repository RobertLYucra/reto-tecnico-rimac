import { AppointmentDynamoItem } from "../entities/appointment-dynamo-item";

export interface AppointmentDynamoRepository {
    findAll(): Promise<any[]>;
    createAppointmentDynamo(item: AppointmentDynamoItem): Promise<AppointmentDynamoItem>
    updateStatusByAppointmentId(appointmentId: string, newStatus: string, completedAt?: string)
    getAppointmentById(appointmentId: string): Promise<AppointmentDynamoItem | null>
    getAppointmentsByInsuredId(insuredId: string): Promise<AppointmentDynamoItem[]>
    getAppointmentsByScheduleId(scheduleId: number): Promise<AppointmentDynamoItem[]>
}