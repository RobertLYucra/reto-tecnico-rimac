import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { CreateAppoitmentUseCase } from "../../application/create-appoitment.use.case";
import { CreateAppointmentDto } from "../../domain/dto/create-appointment.dto";
import { ResponseDto } from "src/shared/dto/response.dto";


@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppoitmentUseCase,
    ) { }

    @Post("createAppointment")
    async createAppointment(@Body() params: CreateAppointmentDto, @Res() response: Response,) {
        try {
            const appointmentCreated = await this.createAppointmentUseCase.createAppointment(params)
            return response.status(200).json(new ResponseDto(true, 'Appointment Creado correctamente', appointmentCreated));
        } catch (error) {
            return response.status(400).json(new ResponseDto(false, error.message));
        }
    }
}