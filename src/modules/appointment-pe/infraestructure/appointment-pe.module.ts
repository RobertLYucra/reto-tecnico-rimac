import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentPeruEntity } from "../domain/entities/appointment-peru.entity";
import { PeAppointmentTypeOrmRepository } from "./data-source/pe-appointment-typeorm.repository";
import { PeCreateTopicAppoitmentUseCase } from "../application/peru-create-topic-appointment.use.case";
import { AppoitmentModule } from "src/modules/appointment/infraestructure/appointment.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentPeruEntity], 'PE'),
        AppoitmentModule
    ],
    controllers: [],
    providers: [
        {
            useClass: PeAppointmentTypeOrmRepository,
            provide: "PeAppointmentRepository"
        },
        PeCreateTopicAppoitmentUseCase,
        
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentPEModule { }