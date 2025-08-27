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

    @Get("getByAppointmentId/:appointmentId")
    @ApiOperation({ summary: 'Obtener cita por ID' })
    @ApiParam({ name: 'appointmentId', type: String, example: '01K3M2ZPQCE93NHAXTVWZXGDXX' })
    async getApointmentById(@Param("appointmentId") appointmentId: string, @Res() response: Response,) {
        try {

            const appointmentsFound = await this.getAppointmentUseCase.getAppointById(appointmentId)
            return response.status(200).json(new ResponseDto(true, 'Cita encontrado', appointmentsFound));

        } catch (error) {
            return response.status(400).json(new ResponseDto(false, error.message));
        }
    }

    @Get("getByinsureId/:insureId")
    @ApiOperation({ summary: 'Obtener cita por InsureId' })
    @ApiParam({ name: 'insureId', type: String, example: '123654' })
    async getApointmentByInsureId(@Param("insureId") insureId: string, @Res() response: Response,) {
        try {

            const appointmentsList = await this.getAppointmentUseCase.getAppointmentsByInsuredId(insureId)
            return response.status(200).json(new ResponseDto(true, 'Lista de Appointments por InsureID', appointmentsList));

        } catch (error) {
            return response.status(400).json(new ResponseDto(false, error.message));
        }
    }

    @Get("getByScheduleId/:scheduleId")
    @ApiOperation({ summary: 'Obtener cita por scheduleId' })
    @ApiParam({ name: 'scheduleId', type: String, example: 100 })
    async getApointmentByScheduleId(@Param("scheduleId") scheduleId: number, @Res() response: Response,) {
        try {

            const appointmentsList = await this.getAppointmentUseCase.getAppointmentsByScheduleId(scheduleId)
            return response.status(200).json(new ResponseDto(true, 'Lista de Appointments por scheduleId', appointmentsList));

        } catch (error) {
            return response.status(400).json(new ResponseDto(false, error.message));
        }
    }
}