// src/application/dto/appointment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsISO8601, IsEnum } from 'class-validator';

export class AppointmentResponseDto {
    @ApiProperty({ example: 'Cita está siendo procesado' })
    @IsString()
    message: string;

    @ApiProperty({ example: '01K3M2ZPQCE93NHAXTVWZXGDXX' })
    @IsString()
    id: string;

    @ApiProperty({ example: '01234' })
    @IsString()
    insuredId: string;

    @ApiProperty({ example: 100 })
    @IsInt()
    scheduleId: number;

    @ApiProperty({ example: 'PENDING' })
    status: string;

    @ApiProperty({ example: '2025-08-26T21:01:47.114Z' })
    @IsISO8601()
    createdAt: string;

    @ApiProperty({ example: 'PE' })
    countryISO: string
}
