import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { CreateAppoitmentUseCase } from "../../application/create-appoitment.use.case";
import { CreateAppointmentDto } from "../../domain/dto/create-appointment.dto";
import { ResponseDto } from "src/shared/dto/response.dto";
import { GetAppointmentUseCase } from "../../application/get-appointment.use.case";
import { ApiOperation, ApiParam } from "@nestjs/swagger";


@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppoitmentUseCase,
        private readonly getAppointmentUseCase: GetAppointmentUseCase,
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

    @Get(":appointmentId")
    @ApiOperation({ summary: 'Obtener cita por ID' })
    @ApiParam({ name: 'appointmentId', type: String, example: '01K3M2ZPQCE93NHAXTVWZXGDXX' })
    async getApointmentById(@Param("appointmentId") appointmentId: string, @Res() response: Response,) {
        try {

            const appointmentFound = await this.getAppointmentUseCase.getAppointById(appointmentId)
            return response.status(200).json(new ResponseDto(true, 'Cita encontrado', appointmentFound));

        } catch (error) {
            return response.status(400).json(new ResponseDto(false, error.message));
        }
    }
}