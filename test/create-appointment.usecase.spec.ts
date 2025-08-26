// test/create-appointment.usecase.spec.ts
import { CreateAppoitmentUseCase } from '../src/modules/appointment/application/create-appoitment.use.case';
import { AppointmentDynamoRepository } from '../src/modules/appointment/domain/repositories/appointment-dynamo.repository';
import { SnsService } from '../src/shared/aws/sns.service';
import { GetPeTopicAppoitmentUseCase } from '../src/modules/appointment-peru/application/get-peru-appointments.use.case';
import { CreateAppointmentDto } from '../src/modules/appointment/domain/dto/create-appointment.dto';

describe('CreateAppoitmentUseCase', () => {
  const ddbRepo = {
    createAppointmentDynamo: jest.fn(),
  } as unknown as jest.Mocked<AppointmentDynamoRepository>;

  const sns = {
    publishAppointmentAccepted: jest.fn(),
  } as unknown as jest.Mocked<SnsService>;

  const getPeSchedule = {
    getPeruTopicAppointmentById: jest.fn(),
  } as unknown as jest.Mocked<GetPeTopicAppoitmentUseCase>;

  let usecase: CreateAppoitmentUseCase;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-08-26T21:01:47.114Z'));
    jest.resetAllMocks();
    usecase = new CreateAppoitmentUseCase(ddbRepo as any, sns as any, getPeSchedule as any);
    // Opcional: fija el ARN si lo lees del env
    (process as any).env.SNS_TOPIC_ARN = 'arn:aws:sns:us-east-2:123:topic';
  });

  it('crea cita, publica SNS y devuelve response mapeado', async () => {
    const dto: CreateAppointmentDto = { insuredId: '01234', scheduleId: 100, countryISO: 'PE' };

    getPeSchedule.getPeruTopicAppointmentById.mockResolvedValue({
      centerId: 1, medicId: 2, specialtyId: 3, date: new Date('2025-09-30T12:30:00.000Z'),
    });

    const created = {
      PK: 'INSURED#01234',
      SK: 'APPT#100',
      appointmentId: 'ULID-1',
      insuredId: '01234',
      scheduleId: 100,
      countryISO: 'PE',
      status: 'PENDING',
      createdAt: '2025-08-26T21:01:47.114Z',
      updatedAt: '2025-08-26T21:01:47.114Z',
      centerId: 1,
      medicId: 2,
      specialtyId: 3,
      dateSchedule: '2025-09-30T12:30:00.000Z',
    };

    ddbRepo.createAppointmentDynamo = jest.fn().mockResolvedValue(created);

    const res = await usecase.createAppointment(dto);

    expect(getPeSchedule.getPeruTopicAppointmentById).toHaveBeenCalledWith(100);
    expect(ddbRepo.createAppointmentDynamo).toHaveBeenCalled();
    expect(sns.publishAppointmentAccepted).toHaveBeenCalledWith(
      expect.objectContaining({
        appointmentId: 'ULID-1',
        insuredId: '01234',
        scheduleId: 100,
        countryISO: 'PE',
        status: 'PENDING',
        PK: 'INSURED#01234',
        SK: 'APPT#100',
      }),
      expect.any(String)
    );
    expect(res).toEqual({
      message: 'Appointment accepted and is being processed',
      id: 'ULID-1',
      insuredId: '01234',
      scheduleId: 100,
      status: 'PENDING',
      createdAt: '2025-08-26T21:01:47.114Z',
    });
  });

  it('lanza error si el schedule no existe', async () => {
    getPeSchedule.getPeruTopicAppointmentById.mockResolvedValue(null as any);
    await expect(
      usecase.createAppointment({ insuredId: '01234', scheduleId: 999, countryISO: 'PE' }),
    ).rejects.toThrow('Programación no existe o fue eliminado');
  });
});
