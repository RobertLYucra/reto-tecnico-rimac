// src/infrastructure/dynamo/appointment-dynamo.repository.ts
import { Injectable } from '@nestjs/common';
import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
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

    async getAppointmentById(appointmentId: string): Promise<AppointmentDynamoItem | null> {
        try {
            const command = new GetItemCommand({
                TableName: this.tableName,
                Key: {
                    appointmentId: { S: appointmentId },   // 👈 tu PK
                },
            });

            const response = await this.client.send(command);

            if (response.Item) {
                return unmarshall(response.Item) as AppointmentDynamoItem;
            }

            return null;
        } catch (error) {
            console.error("Error in getById:", error);
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


    // En el repositorio
    async updateStatusByAppointmentId(appointmentId: string, newStatus: string, completedAt?: string) {
        const cmd = new UpdateItemCommand({
            TableName: this.tableName,
            Key: marshall({ appointmentId }),           // <-- CLAVE CORRECTA
            UpdateExpression: "SET #s = :s, #uAt = :uAt" + (completedAt ? ", #cAt = :cAt" : ""),
            ExpressionAttributeNames: { "#s": "status", "#uAt": "updatedAt", ...(completedAt ? { "#cAt": "completedAt" } : {}) },
            ExpressionAttributeValues: marshall({ ":s": newStatus, ":uAt": new Date().toISOString(), ...(completedAt ? { ":cAt": completedAt } : {}) }),
            ConditionExpression: "attribute_exists(appointmentId)",
            ReturnValues: "ALL_NEW",
        });
        const res = await this.client.send(cmd);
        return res.Attributes ? (unmarshall(res.Attributes) as AppointmentDynamoItem) : null;
    }

}
