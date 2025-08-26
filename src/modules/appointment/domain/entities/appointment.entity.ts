import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'appointment_id', type: 'varchar', length: 64 })
  @Index()
  appointmentId: string;

  @Column({ name: 'insured_id', type: 'varchar', length: 10 })
  insuredId: string;

  @Column({ name: 'schedule_id', type: 'int' })
  scheduleId: number;

  @Column({ name: 'country_iso', type: 'char', length: 2 })
  countryIso: 'PE' | 'CL';

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
