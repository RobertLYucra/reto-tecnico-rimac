import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentChileEntity } from "../domain/entities/appointment-chile.entity";
import { ClAppointmentTypeOrmRepository } from "./data-source/cl-appointment-typeorm.repository";
import { ClCreateTopicAppoitmentUseCase } from "../application/chile-create-topic-appointment.use.case";
import { AppoitmentModule } from "src/modules/appointment/infraestructure/appointment.module";
import { GetClTopicAppoitmentUseCase } from "../application/get-chile-appointments.use.case";
import { EventBridgeService } from "src/shared/aws/brigde.service";
import { ScheduleChileEntity } from "../domain/entities/scheduled-chile.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentChileEntity, ScheduleChileEntity], 'CL'),
        AppoitmentModule
    ],
    controllers: [],
    providers: [
        {
            useClass: ClAppointmentTypeOrmRepository,
            provide: "ClAppointmentRepository"
        },
        ClCreateTopicAppoitmentUseCase,
        GetClTopicAppoitmentUseCase,
        EventBridgeService
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentClModule { }