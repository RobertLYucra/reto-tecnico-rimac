import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentChileEntity } from "../domain/entities/appointment-chile.entity";
import { ClAppointmentTypeOrmRepository } from "./data-source/cl-appointment-typeorm.repository";
import { ClCreateTopicAppoitmentUseCase } from "../application/chile-create-topic-appointment.use.case";
import { AppoitmentModule } from "src/modules/appointment/infraestructure/appointment.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentChileEntity], 'CL'),
        AppoitmentModule
    ],
    controllers: [],
    providers: [
        {
            useClass: ClAppointmentTypeOrmRepository,
            provide: "ClAppointmentRepository"
        },
        ClCreateTopicAppoitmentUseCase,
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentPEModule { }