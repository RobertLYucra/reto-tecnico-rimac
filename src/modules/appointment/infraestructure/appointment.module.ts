import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./controller/appointment.controller";
import { CreateAppoitmentUseCase } from "../application/create-appoitment.use.case";
import { AppointmentDynamoDSRepository } from "./data-source/appointment-dynamo-ds.repository";
import { SqsService } from "src/shared/aws/sqs.service";
import { SnsService } from "src/shared/aws/sns.service";
import { TopicAppoitmentUseCase } from "../application/topic-appointment.use.case";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),

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

    ],
    exports: [TypeOrmModule],
})
export class AppoitmentModule { }