// src/test/unit/appointment/create-appointment.usecase.spec.ts
import { CreateAppoitmentUseCase } from 'src/modules/appointment/application/create-appoitment.use.case';

class FakeAppointmentDynamoRepository {
    createAppointmentDynamo = jest.fn();
}
class FakeSnsService {
    publishAppointmentAccepted = jest.fn();
}
class FakeGetPeTopicAppoitmentUseCase {
    getPeruTopicAppointmentById = jest.fn();
}

class FakeGetClTopicAppoitmentUseCase {
    getChileTopicAppointmentById = jest.fn();
}

describe('CreateAppoitmentUseCase (unit)', () => {
    let useCase: CreateAppoitmentUseCase;
    let repo: FakeAppointmentDynamoRepository;
    let sns: FakeSnsService;
    let getPe: FakeGetPeTopicAppoitmentUseCase;
    let getCl: FakeGetClTopicAppoitmentUseCase;

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV, SNS_TOPIC_ARN: 'arn:aws:sns:us-east-2:123456789012:appointment-topic' };

        repo = new FakeAppointmentDynamoRepository();
        sns = new FakeSnsService();
        getPe = new FakeGetPeTopicAppoitmentUseCase();
        getCl = new FakeGetClTopicAppoitmentUseCase();

        // Instanciación directa (sin Nest TestingModule)
        useCase = new CreateAppoitmentUseCase(
            repo as any,
            sns as any,
            getPe as any,
            getCl as any
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
        process.env = OLD_ENV;
    });

    it('crea la cita en Dynamo, publica en SNS y retorna el response mapeado', async () => {
        // schedule encontrado (lo que devuelve el UC de Perú)
        const scheduleDate = new Date('2025-08-26T12:34:56.000Z');
        getPe.getPeruTopicAppointmentById.mockResolvedValue({
            centerId: 10,
            date: scheduleDate,
            medicId: 20,
            specialtyId: 30,
        });

        const input = {
            insuredId: 'INS-01',
            scheduleId: 100,
            countryISO: 'PE',
        } as any; // CreateAppointmentDto

        // Haremos que el repo devuelva exactamente lo que recibe (estilo “echo”)
        repo.createAppointmentDynamo.mockImplementation(async (item: any) => item);

        const result = await useCase.createAppointment(input);

        // 1) Se consultó el schedule en Perú
        expect(getPe.getPeruTopicAppointmentById).toHaveBeenCalledWith(100);

        // 2) Se construyó y guardó el item en Dynamo
        expect(repo.createAppointmentDynamo).toHaveBeenCalledTimes(1);
        const [savedItem] = repo.createAppointmentDynamo.mock.calls[0];

        expect(savedItem).toEqual(
            expect.objectContaining({
                PK: 'INSURED#INS-01',
                SK: 'APPT#100',
                insuredId: 'INS-01',
                scheduleId: 100,
                countryISO: 'PE',
                status: 'PENDING',
                centerId: 10,
                dateSchedule: scheduleDate.toISOString(),
                medicId: 20,
                specialtyId: 30,
            }),
        );
        expect(savedItem.appointmentId).toEqual(expect.any(String));
        expect(savedItem.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
        expect(savedItem.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);

        // 3) Se publicó a SNS con el topic del ENV/constante
        expect(sns.publishAppointmentAccepted).toHaveBeenCalledTimes(1);
        const [payload, topicArn] = sns.publishAppointmentAccepted.mock.calls[0];

        expect(topicArn).toBe('arn:aws:sns:us-east-2:123456789012:appointment-topic');
        expect(payload).toEqual(
            expect.objectContaining({
                appointmentId: expect.any(String),
                insuredId: 'INS-01',
                scheduleId: 100,
                countryISO: 'PE',
                status: 'PENDING',
                PK: 'INSURED#INS-01',
                SK: 'APPT#100',
            }),
        );
        expect(payload.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);

        // 4) Retorna un objeto (mapeado). No asumimos forma exacta del mapper; validamos que exista.
        expect(result).toBeTruthy();
        // si conoces el shape, puedes hacer expect.objectContaining(...)
    });

    it('lanza error si el schedule no existe', async () => {
        getPe.getPeruTopicAppointmentById.mockResolvedValue(null);

        await expect(
            useCase.createAppointment({ insuredId: 'X', scheduleId: 1, countryISO: 'PE' } as any),
        ).rejects.toThrow('Programación no existe o fue eliminado');

        expect(repo.createAppointmentDynamo).not.toHaveBeenCalled();
        expect(sns.publishAppointmentAccepted).not.toHaveBeenCalled();
    });

    it('lanza error si no se pudo crear la cita en Dynamo', async () => {
        getPe.getPeruTopicAppointmentById.mockResolvedValue({
            centerId: 1, date: '2025-08-26', medicId: 2, specialtyId: 3,
        });
        repo.createAppointmentDynamo.mockResolvedValue(null);

        await expect(
            useCase.createAppointment({ insuredId: 'Y', scheduleId: 2, countryISO: 'PE' } as any),
        ).rejects.toThrow('No se pudo crear la Cita');

        expect(sns.publishAppointmentAccepted).not.toHaveBeenCalled();
    });
});