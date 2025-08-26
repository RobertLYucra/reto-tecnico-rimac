import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

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
  countryIso: 'PE' | 'CL' | string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: "deleted", default: false })
  deleted: boolean
}
