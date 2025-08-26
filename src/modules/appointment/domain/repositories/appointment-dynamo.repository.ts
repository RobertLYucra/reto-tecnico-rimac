import { AppointmentEntity } from "../entities/appointment.entity";

export interface AppointmentDynamoRepository {
    findAll(): Promise<any>;

}