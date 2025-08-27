import { ClCreateTopicAppoitmentUseCase } from "src/modules/appointment-chile/application/chile-create-topic-appointment.use.case";
import { AppointmentEventDto, AppointmentStatus } from "src/modules/appointment-peru/domain/dto/create-appointment.dto";


class FakeClAppointmentRepository {
  createAppointment = jest.fn();
}

class FakeEventBridgeService {
  sendEvent = jest.fn();
}

describe('ClCreateTopicAppoitmentUseCase (sin jest.mock)', () => {
  let useCase: ClCreateTopicAppoitmentUseCase;
  let repo: FakeClAppointmentRepository;
  let bridge: FakeEventBridgeService;

  beforeEach(() => {
    repo = new FakeClAppointmentRepository();
    bridge = new FakeEventBridgeService();
    useCase = new ClCreateTopicAppoitmentUseCase(
      repo as any,
      bridge as any
    );
    jest.clearAllMocks();
  });

  it('crea la cita en Chile y envía evento a EventBridge', async () => {
    const input: AppointmentEventDto = {
      appointmentId: 'APPT-1',
      insuredId: 'INS-9',
      scheduleId: 77,
      countryISO: 'CL',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-9',
      SK: 'APPT#77',
    };

    // lo que devolverá el repo al crear
    repo.createAppointment.mockResolvedValue({
      id: 123,
      scheduleId: 77,
    });

    await useCase.chileTopicAppointment(input);

    // 1) se crea con status COMPLETED (como define tu caso de uso)
    expect(repo.createAppointment).toHaveBeenCalledTimes(1);
    expect(repo.createAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        countryIso: 'CL',
        appointmentId: 'APPT-1',
        insuredId: 'INS-9',
        scheduleId: 77,
        deleted: false,
        status: 'COMPLETED',
      })
    );

    // 2) se envía el evento a EventBridge con los datos mapeados
    expect(bridge.sendEvent).toHaveBeenCalledTimes(1);
    const [detailType, source, detail] = bridge.sendEvent.mock.calls[0];

    expect(detailType).toBe('appointment.completed');
    expect(source).toBe('AppointmentCompleted');
    expect(detail).toEqual(
      expect.objectContaining({
        id: 123,
        appointmentId: 'APPT-1',
        insuredId: 'INS-9',
        countryISO: 'CL',
        status: 'COMPLETED',
        scheduleId: 77,
      })
    );
    // timestamp ISO
    expect(detail.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
  });

  it('si no se crea la cita, no envía evento y retorna', async () => {
    const input: AppointmentEventDto = {
      appointmentId: 'APPT-2',
      insuredId: 'INS-10',
      scheduleId: 88,
      countryISO: 'CL',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-10',
      SK: 'APPT#88',
    };

    repo.createAppointment.mockResolvedValue(null);

    await useCase.chileTopicAppointment(input);

    expect(repo.createAppointment).toHaveBeenCalledTimes(1);
    expect(bridge.sendEvent).not.toHaveBeenCalled();
  });

  it('propaga errores del repositorio', async () => {
    repo.createAppointment.mockRejectedValue(new Error('DB down'));

    const input: AppointmentEventDto = {
      appointmentId: 'APPT-3',
      insuredId: 'INS-11',
      scheduleId: 99,
      countryISO: 'CL',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-11',
      SK: 'APPT#99',
    };

    await expect(useCase.chileTopicAppointment(input)).rejects.toThrow('DB down');
    expect(bridge.sendEvent).not.toHaveBeenCalled();
  });
});