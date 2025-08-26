import { AppointmentDynamoItem } from "../entities/appointment-dynamo-item";

export interface AppointmentDynamoRepository {
    findAll(): Promise<any[]>;
    createAppointmentDynamo(item: AppointmentDynamoItem): Promise<AppointmentDynamoItem>
    updateAppointmentDynamo(pk: string, sk: string, updateData: Partial<AppointmentDynamoItem>): Promise<AppointmentDynamoItem>

}