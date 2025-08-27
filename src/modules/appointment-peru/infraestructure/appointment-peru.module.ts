import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentPeruEntity } from "../domain/entities/appointment-peru.entity";
import { PeAppointmentTypeOrmRepository } from "./data-source/pe-appointment-typeorm.repository";
import { PeCreateTopicAppoitmentUseCase } from "../application/peru-create-topic-appointment.use.case";
import { SchedulePeruEntity } from "../domain/entities/scheduled-peru.entity";
import { EventBridgeService } from "src/shared/aws/brigde.service";
import { GetPeTopicAppoitmentUseCase } from "../application/get-peru-appointments.use.case";
import { AppointmentModule } from "src/modules/appointment/infraestructure/appointment.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentPeruEntity, SchedulePeruEntity], 'PE'),
        forwardRef(() => AppointmentModule)
    ],
    controllers: [],
    providers: [
        {
            useClass: PeAppointmentTypeOrmRepository,
            provide: "PeAppointmentRepository"
        },
        PeCreateTopicAppoitmentUseCase,
        EventBridgeService,
        GetPeTopicAppoitmentUseCase

    ],
    exports: [TypeOrmModule, GetPeTopicAppoitmentUseCase],
})
export class AppointmentPeruModule { }