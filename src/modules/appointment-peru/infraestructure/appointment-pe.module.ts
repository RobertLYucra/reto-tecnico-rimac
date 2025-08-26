import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentPeruEntity } from "../domain/entities/appointment-peru.entity";
import { PeAppointmentTypeOrmRepository } from "./data-source/pe-appointment-typeorm.repository";
import { PeCreateTopicAppoitmentUseCase } from "../application/peru-create-topic-appointment.use.case";
import { AppoitmentModule } from "src/modules/appointment/infraestructure/appointment.module";
import { SchedulePeruEntity } from "../domain/entities/scheduled-peru.entity";
import { EventBridgeService } from "src/shared/aws/brigde.service";
import { GetPeTopicAppoitmentUseCase } from "../application/get-peru-appointments.use.case";


@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentPeruEntity, SchedulePeruEntity], 'PE'),
        forwardRef(() => AppoitmentModule)
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
export class AppoitmentPEModule { }