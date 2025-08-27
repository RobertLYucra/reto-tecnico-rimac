import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CreateAppoitmentUseCase } from 'src/modules/appointment/application/create-appoitment.use.case';
import { GetAppointmentUseCase } from 'src/modules/appointment/application/get-appointment.use.case';
import { AppointmentController } from 'src/modules/appointment/infraestructure/controller/appointment.controller';
import { ResponseDto } from 'src/shared/dto/response.dto';

describe('AppointmentController', () => {
    let controller: AppointmentController;
    let createAppointmentUseCase: jest.Mocked<CreateAppoitmentUseCase>;
    let getAppointmentUseCase: jest.Mocked<GetAppointmentUseCase>;

    const mockResponse = (): Response => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        return res as unknown as Response;
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentController],
            providers: [
                {
                    provide: CreateAppoitmentUseCase,
                    useValue: {
                        createAppointment: jest.fn(),
                    },
                },
                {
                    provide: GetAppointmentUseCase,
                    useValue: {
                        getAppointById: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(AppointmentController);
        createAppointmentUseCase = module.get(CreateAppoitmentUseCase);
        getAppointmentUseCase = module.get(GetAppointmentUseCase);
    });

    afterEach(() => jest.clearAllMocks());

    it('POST /appointment/createAppointment → 200', async () => {
        const res = mockResponse();
        const mockBody = {
            insuredId: 'INS-01',
            scheduleId: 101,
            countryISO: 'PE',
        };

        const mockAppointment = {
            id: 'A123',
            insuredId: 'INS-01',
            scheduleId: 101,
            countryISO: 'PE',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            message: 'Appointment accepted'
        };


        createAppointmentUseCase.createAppointment.mockResolvedValue(mockAppointment);

        await controller.createAppointment(mockBody as any, res);

        expect(createAppointmentUseCase.createAppointment).toHaveBeenCalledWith(mockBody);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ResponseDto(true, 'Appointment Creado correctamente', mockAppointment));
    });

    it('POST /appointment/createAppointment → 400 (error)', async () => {
        const res = mockResponse();
        const errorMessage = 'DB error';
        createAppointmentUseCase.createAppointment.mockRejectedValue(new Error(errorMessage));

        await controller.createAppointment({} as any, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new ResponseDto(false, errorMessage));
    });

    it('GET /appointment/:id → 200', async () => {
        const res = mockResponse();
        const appointmentId = 'A123';
        const mockData = {
            id: 'A123',
            insuredId: 'INS-01',
            scheduleId: 101,
            countryISO: 'PE',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
            message: 'ok'
        };

        getAppointmentUseCase.getAppointById.mockResolvedValue(mockData);

        await controller.getApointmentById(appointmentId, res);

        expect(getAppointmentUseCase.getAppointById).toHaveBeenCalledWith(appointmentId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new ResponseDto(true, 'Cita encontrado', mockData));
    });

    it('GET /appointment/:id → 400 (error)', async () => {
        const res = mockResponse();
        const appointmentId = 'BAD-ID';
        const errorMessage = 'Appointment not found';

        getAppointmentUseCase.getAppointById.mockRejectedValue(new Error(errorMessage));

        await controller.getApointmentById(appointmentId, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new ResponseDto(false, errorMessage));
    });
});