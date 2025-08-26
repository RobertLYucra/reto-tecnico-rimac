import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsISO8601 } from 'class-validator';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class AppointmentEventDto {
  @ApiProperty({ example: '01K3M2ZPQCE93NHAXTVWZXGDXX' })
  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({ example: '01234' })
  @IsString()
  @IsNotEmpty()
  insuredId: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  scheduleId: number;

  @ApiProperty({ enum: ['PE', 'CL'], example: 'CL' })
  @IsString()
  @IsNotEmpty()
  countryISO: 'PE' | 'CL';

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.PENDING })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({ example: '2025-08-26T21:01:47.114Z' })
  @IsISO8601()
  createdAt: string;

  @ApiProperty({ example: 'INSURED#01234' })
  @IsString()
  @IsNotEmpty()
  PK: string;

  @ApiProperty({ example: 'APPT#100' })
  @IsString()
  @IsNotEmpty()
  SK: string;
}
