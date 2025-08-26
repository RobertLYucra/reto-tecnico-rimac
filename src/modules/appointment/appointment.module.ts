import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./infraestructure/controller/appointment.controller";
import { AppointmentTypeOrmRepository } from "./infraestructure/data-source/appointment-typeorm.repository";
import { CreateAppoitmentUseCase } from "./application/create-appoitment.use.case";
import { AppointmentEntity } from "./domain/entities/appointment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentEntity, ]),
    ],
    controllers: [AppointmentController],
    providers: [
        CreateAppoitmentUseCase,
        {
            useClass: AppointmentTypeOrmRepository,
            provide: "AppointmentRepository"
        },
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentModule { }