import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber, IsIn, Matches } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty({
        example: '01234',
        description: 'Código del asegurado, exactamente 5 dígitos.',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{5}$/, { message: 'insuredId debe tener exactamente 5 dígitos' })
    insuredId: string;

    @ApiProperty({
        example: 100,
        description: 'Identificador del espacio de agendamiento (scheduleId).',
    })
    @IsNumber()
    @IsNotEmpty()
    scheduleId: number;

    @ApiProperty({
        example: 'PE',
        description: 'Código ISO del país. Solo se permite PE o CL.',
        enum: ['PE', 'CL'],
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['PE', 'CL'], { message: 'countryISO debe ser PE o CL' })
    countryISO: 'PE' | 'CL';
}