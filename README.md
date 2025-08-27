# Reto Técnico Rimac - API Serverless con NestJS

Este proyecto implementa una API de agendamiento de citas médicas usando **NestJS**, arquitectura **DDD**, y empaquetado con **Serverless Framework**.  
Este documento explica únicamente cómo levantar el proyecto en local con `serverless-offline`.

## 🚀 Requisitos

- Node.js v18 o superior  
- NPM v9 o superior  
- Serverless Framework instalado globalmente:  
  ```bash
  npm install -g serverless
Docker (opcional, si deseas levantar DynamoDB localmente para pruebas)

📥 Instalación
bash
Copiar código
git clone https://github.com/tu-usuario/reto-tecnico-rimac.git
cd reto-tecnico-rimac
npm install
⚙️ Variables de entorno
Crea un archivo .env en la raíz del proyecto con los siguientes valores de ejemplo:

ini
Copiar código
DB_PORT=3306
PE_DB_HOST=localhost
PE_DB_USERNAME=root
PE_DB_PASSWORD=1234
PE_DB_NAME=appointment_pe

CL_DB_HOST=localhost
CL_DB_USERNAME=root
CL_DB_PASSWORD=1234
CL_DB_NAME=appointment_cl

APP_REGION=us-east-2
APPOINTMENT_TABLE_NAME=appointment
SNS_TOPIC_ARN=arn:aws:sns:us-east-2:000000000000:appointment-scheduling-topic
▶️ Levantar el proyecto en local
bash
Copiar código
serverless offline --stage test
La API quedará disponible en:

http://localhost:3000/test/api-appointment

📚 Documentación Swagger
Swagger UI: http://localhost:3000/swagger

Swagger JSON: http://localhost:3000/swagger-json

🧪 Probar la API en local
Crear cita
bash
Copiar código
curl -X POST http://localhost:3000/test/api-appointment/appointment/createAppointment \
  -H "Content-Type: application/json" \
  -d '{"insuredId":"01234","scheduleId":100,"countryISO":"PE"}'
Obtener cita por ID
bash
Copiar código
curl http://localhost:3000/test/api-appointment/appointment/A1
Obtener citas por asegurado
bash
Copiar código
curl http://localhost:3000/test/api-appointment/appointment/INSURED#01234
✅ Notas
La base de datos en local puede simularse con DynamoDB Local + MySQL en Docker, o conectarse a instancias reales en AWS.

Todos los handlers (api, appointmentTopic, peruTopicAppointmentHandler, chileTopicAppointmentHandler, confirmAppointmentHandler) están listos para ejecutarse con serverless-offline.

El endpoint de Swagger incluye servidores tanto locales como de AWS (localhost:3000/test/api-appointment y execute-api...amazonaws.com/test/api-appointment).