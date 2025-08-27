import { AppointmentEventDto, AppointmentStatus } from "../domain/dto/create-appointment.dto";
import { PeCreateTopicAppoitmentUseCase } from "./peru-create-topic-appointment.use.case";


// Fakes (sin jest.mock de módulos)
class FakePeAppointmentRepository {
  createAppointment = jest.fn();
}

class FakeEventBridgeService {
  sendEvent = jest.fn();
}

describe('PeCreateTopicAppoitmentUseCase (sin mocks de módulos)', () => {
  let useCase: PeCreateTopicAppoitmentUseCase;
  let repo: FakePeAppointmentRepository;
  let bridge: FakeEventBridgeService;

  beforeEach(() => {
    repo = new FakePeAppointmentRepository();
    bridge = new FakeEventBridgeService();
    // Instanciación directa (sin Nest DI)
    useCase = new PeCreateTopicAppoitmentUseCase(repo as any, bridge as any);
    jest.clearAllMocks();
  });

  it('crea cita en Perú y envía evento COMPLETED a EventBridge', async () => {
    const input: AppointmentEventDto = {
      appointmentId: 'APPT-PE-1',
      insuredId: 'INS-PE-9',
      scheduleId: 77,
      countryISO: 'PE',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-PE-9',
      SK: 'APPT#77',
    };

    // Respuesta del repo al crear
    repo.createAppointment.mockResolvedValue({
      id: 321,
      scheduleId: 77,
    });

    await useCase.peruTopicAppointment(input);

    // 1) Se crea el registro con status COMPLETED
    expect(repo.createAppointment).toHaveBeenCalledTimes(1);
    expect(repo.createAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        countryIso: 'PE',
        appointmentId: 'APPT-PE-1',
        insuredId: 'INS-PE-9',
        scheduleId: 77,
        deleted: false,
        status: 'COMPLETED',
      })
    );

    // 2) Se envía el evento a EventBridge
    expect(bridge.sendEvent).toHaveBeenCalledTimes(1);
    const [detailType, source, detail] = bridge.sendEvent.mock.calls[0];

    expect(detailType).toBe('appointment.completed');
    expect(source).toBe('AppointmentCompleted');
    expect(detail).toEqual(
      expect.objectContaining({
        id: 321,
        appointmentId: 'APPT-PE-1',
        insuredId: 'INS-PE-9',
        countryISO: 'PE',
        status: 'COMPLETED',
        scheduleId: 77,
      })
    );
    expect(detail.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
  });

  it('si no se crea la cita, no envía evento y retorna', async () => {
    const input: AppointmentEventDto = {
      appointmentId: 'APPT-PE-2',
      insuredId: 'INS-PE-10',
      scheduleId: 88,
      countryISO: 'PE',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-PE-10',
      SK: 'APPT#88',
    };

    repo.createAppointment.mockResolvedValue(null);

    await useCase.peruTopicAppointment(input);

    expect(repo.createAppointment).toHaveBeenCalledTimes(1);
    expect(bridge.sendEvent).not.toHaveBeenCalled();
  });

  it('propaga errores del repositorio', async () => {
    repo.createAppointment.mockRejectedValue(new Error('DB error'));

    const input: AppointmentEventDto = {
      appointmentId: 'APPT-PE-3',
      insuredId: 'INS-PE-11',
      scheduleId: 99,
      countryISO: 'PE',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      PK: 'INSURED#INS-PE-11',
      SK: 'APPT#99',
    };

    await expect(useCase.peruTopicAppointment(input)).rejects.toThrow('DB error');
    expect(bridge.sendEvent).not.toHaveBeenCalled();
  });
});
