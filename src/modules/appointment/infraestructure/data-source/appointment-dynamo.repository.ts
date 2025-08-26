// src/infrastructure/dynamo/appointment-dynamo.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { AppointmentDynamoItem } from '../../domain/entities/appointment-dynamo-item';
import { APP_REGION, APPOINTMENT_TABLE_NAME } from 'src/shared/constants/connection.constant';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';


@Injectable()
export class AppointmentDynamoDSRepository {
    private readonly tableName = APPOINTMENT_TABLE_NAME
    private readonly client: DynamoDBClient

    constructor() {
        this.client = new DynamoDBClient({
            region: APP_REGION
        })
    }

    async findAll() {
        const result: AppointmentDynamoItem[] = []

        const command = new ScanCommand({
            TableName: this.tableName
        })

        const response = await this.client.send(command)
        if (response.Items) {
            return response
        }
    }

    async createAppointmentDynamo(item: AppointmentDynamoItem): Promise<AppointmentDynamoItem> {
        await this.client.send(
            new PutItemCommand({
                TableName: this.tableName,
                Item: marshall(item, { removeUndefinedValues: true }), // <- clave
                ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
            })
        );
        return item;
    }

}
