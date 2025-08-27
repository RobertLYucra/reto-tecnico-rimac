import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./controller/appointment.controller";
import { CreateAppoitmentUseCase } from "../application/create-appoitment.use.case";
import { AppointmentDynamoDSRepository } from "./data-source/appointment-dynamo-ds.repository";
import { SqsService } from "src/shared/aws/sqs.service";
import { SnsService } from "src/shared/aws/sns.service";
import { TopicAppoitmentUseCase } from "../application/topic-appointment.use.case";
import { UpdateAppoitmentUseCase } from "../application/update-appointment.usecase";
import { GetAppointmentUseCase } from "../application/get-appointment.use.case";
import { AppointmentChileModule } from "src/modules/appointment-chile/infraestructure/appointment-chile.module";
import { AppointmentPeruModule } from "src/modules/appointment-peru/infraestructure/appointment-peru.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        AppointmentPeruModule,
        AppointmentChileModule
    ],
    controllers: [AppointmentController],
    providers: [
        {
            useClass: AppointmentDynamoDSRepository,
            provide: "AppointmentDynamoRepository"
        },
        CreateAppoitmentUseCase,
        SnsService,
        SqsService,
        TopicAppoitmentUseCase,
        UpdateAppoitmentUseCase,
        GetAppointmentUseCase
    ],
    exports: [TypeOrmModule],
})
export class AppointmentModule { }