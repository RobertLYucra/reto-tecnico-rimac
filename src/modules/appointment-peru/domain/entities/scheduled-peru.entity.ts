import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schedules')
export class SchedulePeruEntity {
    @PrimaryGeneratedColumn({ name: 'schedule_id', type: 'int' })
    scheduleId: number;

    @Column({ name: 'center_id', type: 'int', nullable: false })
    centerId: number;

    @Column({ name: 'specialty_id', type: 'int', nullable: false })
    specialtyId: number;

    @Column({ name: 'medic_id', type: 'int', nullable: false })
    medicId: number;

    @Column({ name: 'date', type: 'datetime', nullable: false })
    date: Date;

    @Column({
        name: 'status',
        type: 'enum',
        enum: ['booked', 'available', 'cancelled'],
        default: 'available',
    })
    status: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
