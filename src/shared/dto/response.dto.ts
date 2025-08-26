// src/common/dto/response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Operación realizada correctamente' })
    message: string;

    @ApiProperty({ required: false })
    data?: T;

    constructor(success: boolean, message: string, data?: T) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}