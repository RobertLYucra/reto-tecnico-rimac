// src/application/models/appointment-dynamo-item.ts
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface AppointmentDynamoItem {
  PK: string;               // INSURED#01234
  SK: string;               // APPT#100
  appointmentId: string;               // ulid
  insuredId: string;        // "01234"
  scheduleId: number;       // 100
  countryISO: 'PE' | 'CL';
  status: Status;
  createdAt: string;        // ISO
  updatedAt: string;        // ISO

  // Extras opcionales (auditoría/UX)
  clinicId?: string;
  specialtyId?: string;
  doctorId?: string;
  slot?: { date: string; start: string; end: string };
  notes?: string;
}
