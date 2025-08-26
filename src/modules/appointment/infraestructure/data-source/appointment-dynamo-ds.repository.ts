// src/infrastructure/dynamo/appointment-dynamo.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { AppointmentDynamoItem } from '../../domain/entities/appointment-dynamo-item';
import { APP_REGION, APPOINTMENT_TABLE_NAME } from 'src/shared/constants/connection.constant';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { AppointmentDynamoRepository } from '../../domain/repositories/appointment-dynamo.repository';


@Injectable()
export class AppointmentDynamoDSRepository implements AppointmentDynamoRepository {
    private readonly tableName = APPOINTMENT_TABLE_NAME
    private readonly client: DynamoDBClient

    constructor() {
        this.client = new DynamoDBClient({
            region: APP_REGION
        })
    }

    async findAll(): Promise<AppointmentDynamoItem[]> {
        try {
            const command = new ScanCommand({
                TableName: this.tableName
            });

            const response = await this.client.send(command);

            if (response.Items && response.Items.length > 0) {
                return response.Items.map(item => unmarshall(item) as AppointmentDynamoItem);
            }

            return [];
        } catch (error) {
            throw error;
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

    async updateAppointmentDynamo(pk: string, sk: string, updateData: Partial<AppointmentDynamoItem>): Promise<AppointmentDynamoItem> {
        try {
            // Remover PK y SK del updateData
            const { PK, SK, ...dataToUpdate } = updateData;

            // Construir UpdateExpression dinámicamente
            const updateExpressions: string[] = [];
            const expressionAttributeNames: Record<string, string> = {};
            const expressionAttributeValues: Record<string, any> = {};

            Object.keys(dataToUpdate).forEach((key, index) => {
                const nameKey = `#attr${index}`;
                const valueKey = `:val${index}`;

                updateExpressions.push(`${nameKey} = ${valueKey}`);
                expressionAttributeNames[nameKey] = key;
                expressionAttributeValues[valueKey] = dataToUpdate[key];
            });

            const command = new UpdateItemCommand({
                TableName: this.tableName,
                Key: marshall({ PK: pk, SK: sk }),
                UpdateExpression: `SET ${updateExpressions.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: marshall(expressionAttributeValues, {
                    removeUndefinedValues: true
                }),
                ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
                ReturnValues: 'ALL_NEW'
            });

            const response = await this.client.send(command);

            if (response.Attributes) {
                return unmarshall(response.Attributes) as AppointmentDynamoItem;
            }

            throw new Error('No item returned after update');
        } catch (error) {
            console.error(`Error updating appointment:`, error);
            throw error;
        }
    }
}
