import { AppointmentResponseDto } from "../../domain/dto/response/appointment.response.dto";
import { AppointmentDynamoItem } from "../../domain/entities/appointment-dynamo-item";

export function AppointmentMapping(
    item: AppointmentDynamoItem
): AppointmentResponseDto {
    return {
        message: "",
        id: item.appointmentId,
        insuredId: item.insuredId,
        scheduleId: item.scheduleId,
        status: item.status,
        createdAt: item.createdAt,
        countryISO : item.countryISO
    };
}