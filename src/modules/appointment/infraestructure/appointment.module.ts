import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./controller/appointment.controller";
import { CreateAppoitmentUseCase } from "../application/create-appoitment.use.case";
import { AppointmentDynamoDSRepository } from "./data-source/appointment-dynamo-ds.repository";
import { SqsService } from "src/shared/aws/sqs.service";
import { SnsService } from "src/shared/aws/sns.service";
import { TopicAppoitmentUseCase } from "../application/topic-appointment.use.case";
import { UpdateAppoitmentUseCase } from "../application/update-appointment.usecase";
import { AppoitmentPEModule } from "src/modules/appointment-peru/infraestructure/appointment-pe.module";
import { GetAppointmentUseCase } from "../application/get-appointment.use.case";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        AppoitmentPEModule
    ],
    controllers: [AppointmentController],
    providers: [
        CreateAppoitmentUseCase,
        {
            useClass: AppointmentDynamoDSRepository,
            provide: "AppointmentDynamoRepository"
        },

        SnsService,
        SqsService,
        TopicAppoitmentUseCase,
        UpdateAppoitmentUseCase,
        GetAppointmentUseCase
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentModule { }