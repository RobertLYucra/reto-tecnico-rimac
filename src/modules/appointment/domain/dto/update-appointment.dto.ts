export interface AppointmentUpdateEvent {
  id: string;
  appointmentId: string;
  insuredId: string;
  countryISO: string;
  status: string;
  timestamp: string;
  scheduleId: number;
}
