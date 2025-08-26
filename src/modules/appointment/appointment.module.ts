import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./infraestructure/controller/appointment.controller";
import { AppointmentTypeOrmRepository } from "./infraestructure/data-source/appointment-typeorm.repository";
import { CreateAppoitmentUseCase } from "./application/create-appoitment.use.case";
import { AppointmentEntity } from "./domain/entities/appointment.entity";
import { AppointmentDynamoDSRepository } from "./infraestructure/data-source/appointment-dynamo.repository";
import { SqsService } from "src/shared/aws/sqs.service";
import { SnsService } from "src/shared/aws/sns.service";
import { PeruTopicAppoitmentUseCase } from "./application/peru-topic-appointment.use.case";
import { TopicAppoitmentUseCase } from "./application/topic-appointment.use.case";
import { ChileTopicAppoitmentUseCase } from "./application/chile-topic-appointment.use.case";

@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentEntity,]),

    ],
    controllers: [AppointmentController],
    providers: [
        CreateAppoitmentUseCase,
        {
            useClass: AppointmentTypeOrmRepository,
            provide: "AppointmentRepository"
        },
        AppointmentDynamoDSRepository,
        SnsService,
        SqsService,
        PeruTopicAppoitmentUseCase,
        TopicAppoitmentUseCase,
        ChileTopicAppoitmentUseCase,
    ],
    exports: [TypeOrmModule],
})
export class AppoitmentModule { }