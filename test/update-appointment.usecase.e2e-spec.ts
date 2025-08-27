
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAppoitmentUseCase } from 'src/modules/appointment/application/update-appointment.usecase';


describe('UpdateAppoitmentUseCase', () => {
  let useCase: UpdateAppoitmentUseCase;

  const repoMock = {
    updateStatusByAppointmentId: jest.fn(),
  };

  const snsMock = {}; // no se usa en el método actual

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAppoitmentUseCase,
        // Token string EXACTO que usa @Inject('AppointmentDynamoRepository')
        { provide: 'AppointmentDynamoRepository', useValue: repoMock },
        // Clase como token para SnsService
        { provide: (jest.requireActual('src/shared/aws/sns.service') as any).SnsService, useValue: snsMock },
      ],
    }).compile();

    useCase = module.get(UpdateAppoitmentUseCase);
    jest.clearAllMocks();
  });

  it('debe transformar status=COMPLETED a CONFIRMED y actualizar en Dynamo', async () => {
    const payload = {
      id: 'X1',
      appointmentId: 'A-123',
      insuredId: 'INS-01',
      countryISO: 'PE',
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      scheduleId: 101,
    };

    await useCase.updateAppointment(payload as any);

    expect(repoMock.updateStatusByAppointmentId).toHaveBeenCalledTimes(1);
    const [appointmentId, finalStatus, isoNow] = repoMock.updateStatusByAppointmentId.mock.calls[0];

    expect(appointmentId).toBe('A-123');
    expect(finalStatus).toBe('CONFIRMED'); // mapeo esperado
    expect(typeof isoNow).toBe('string');
    // opcional: validar formato ISO simple
    expect(isoNow).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
  });

  it('debe pasar status=PENDING tal cual en mayúsculas', async () => {
    const payload = {
      id: 'X2',
      appointmentId: 'A-456',
      insuredId: 'INS-02',
      countryISO: 'CL',
      status: 'pending', // minúsculas para verificar upper()
      timestamp: new Date().toISOString(),
      scheduleId: 202,
    };

    await useCase.updateAppointment(payload as any);

    expect(repoMock.updateStatusByAppointmentId).toHaveBeenCalledTimes(1);
    const [appointmentId, finalStatus] = repoMock.updateStatusByAppointmentId.mock.calls[0];

    expect(appointmentId).toBe('A-456');
    expect(finalStatus).toBe('PENDING');
  });

  it('debe propagar el error del repositorio', async () => {
    repoMock.updateStatusByAppointmentId.mockRejectedValueOnce(new Error('Dynamo fail'));

    const payload = {
      id: 'X3',
      appointmentId: 'A-789',
      insuredId: 'INS-03',
      countryISO: 'PE',
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      scheduleId: 303,
    };

    await expect(useCase.updateAppointment(payload as any))
      .rejects
      .toThrow('Dynamo fail');
  });
});