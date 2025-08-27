# Serverless NestJS API - Appointment Service

API de citas médicas desarrollada con NestJS y desplegada usando Serverless Framework.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Serverless Framework CLI
- AWS CLI configurado (para deploy)

## Instalación desde Cero

### 1. Clonación del Repositorio

```bash
git clone https://github.com/RobertLYucra/reto-tecnico-rimac.git
cd reto-tecnico-rimac
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Instalación de Serverless Framework (si no lo tienes)

```bash
npm install -g serverless
```
### 4. Base de Datos MySQL
No se trabajó en RDS por limitaciones, se trabajó en MySQL en otro host
y las estructuras de las tablas está en la riz del proyecto.

Para Hacer pruebas, se valida el Schedule en cada pais (Cada basde de datos)
 
-  Para Schedule ID disponibles: 100, 101,102,103,104,105


- tp_appointment_cl.sql
- tp_appointment_pe.sql


### 5. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database Configuration
DB_PORT=3306
APP_REGION=us-east-2

# Peru Database
PE_DB_HOST= **************
PE_DB_USERNAME=**************
PE_DB_PASSWORD=**************
PE_DB_NAME =tp_appointment_pe

# Chile Database  
CL_DB_HOST=**************
CL_DB_USERNAME=**************
CL_DB_PASSWORD=**************
CL_DB_NAME=tp_appointment_cl
```

## Desarrollo Local

### Levantar el Proyecto en Modo Offline

```bash
serverless offline --stage test
```

El servidor se levantará por defecto en: `http://localhost:3000`

Y la función principal estará en:  `http://localhost:3000/test/api-appointment/{proxy*}`

### Ejecutar Tests

#### Tests End-to-End
```bash
npm run test:e2e
```

## Documentación de la API

### Swagger UI
Una vez levantado el proyecto, puedes acceder a la documentación interactiva en:

```
{{host}}/test/api-appointment/swagger
```

**Ejemplo local:** `http://localhost:3000/test/api-appointment/swagger`

### Swagger JSON
Para obtener la especificación OpenAPI en formato JSON:

```
{{host}}/test/api-appointment/swagger-json
```

**Ejemplo local:** `http://localhost:3000/test/api-appointment/swagger-json`

## Deployment

### Deploy a AWS

Para hacer deploy a AWS, simplemente ejecuta:

```bash
serverless deploy --stage test
```

El stage `test` se mantiene tanto para desarrollo local como para deployment.

### Deploy a Otros Stages

Si necesitas deploy a otros ambientes:
Pero será necesario configurar en serverless.yml
para los demás ambientes

```bash
# Producción
serverless deploy --stage prod

# Desarrollo
serverless deploy --stage dev
```

### Remover Deployment

Para eliminar completamente el stack de AWS:

```bash
serverless remove --stage test
```

## Estructura del Proyecto

```
src/
├── config/                    # Configuración de la aplicación
├── modules/
│   ├── appointment/           # Módulo principal de citas
│   │   ├── application/       # Casos de uso
│   │   ├── domain/           # Entidades, DTOs y repositorios
│   │   └── infrastructure/   # Controladores, módulos y data sources
│   ├── appointment-chile/     # Módulo específico para Chile
│   │   ├── application/
│   │   ├── domain/
│   │   └── infrastructure/
│   └── appointment-peru/      # Módulo específico para Perú
│       ├── application/
│       ├── domain/
│       └── infrastructure/
├── shared/
│   ├── aws/                   # Servicios de AWS (SNS, EventBridge)
│   ├── constants/             # Constantes de la aplicación
│   └── dto/                   # DTOs compartidos
├── app.module.ts              # Módulo principal
├── main.ts                   # Punto de entrada
└── serverless.ts             # Configuración serverless
test/                          # Tests E2E y unitarios
├── *.spec.ts                 # Tests unitarios
└── jest.setup.ts             # Configuración de mocks
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev              # Modo desarrollo con hot-reload
npm run build                  # Compilar el proyecto
npm run start:prod             # Ejecutar en modo producción

# Testing
npm run test                   # Tests unitarios
npm run test:watch             # Tests en modo watch
npm run test:coverage          # Tests con cobertura
npm run test:e2e              # Tests end-to-end

# Linting
npm run lint                   # Ejecutar linter
npm run lint:fix              # Corregir errores de linting automáticamente
```

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `APP_REGION` | Región de AWS | `us-east-2` |
| `PE_DB_HOST` | Host de la BD de Perú | ``***********`` |
| `PE_DB_USERNAME` | Usuario de la BD de Perú | `user_soporte` |
| `PE_DB_PASSWORD` | Contraseña de la BD de Perú | `s0p0rt3.` |
| `PE_DB_NAME` | Nombre de la BD de Perú | `tp_appointment_pe` |
| `CL_DB_HOST` | Host de la BD de Chile | ``***********`` |
| `CL_DB_USERNAME` | Usuario de la BD de Chile | `user_soporte` |
| `CL_DB_PASSWORD` | Contraseña de la BD de Chile | `s0p0rt3.` |
| `CL_DB_NAME` | Nombre de la BD de Chile | `tp_appointment_cl` |

## Endpoints Principales

### Crear Cita
```http
POST /test/api-appointment/appointment/createAppointment
Content-Type: application/json

{
  "insuredId": "string",
  "scheduleId": number,
  "countryISO": "string"
}
```

### Obtener Citas por InsureId
```http
GET /test/api-appointment/appointment/getByinsureId/{appointmentId}
```


### Obtener Cita por ID
```http
GET /test/api-appointment/appointment/getByAppointmentId/{appointmentId}
```


### Obtener Cita por ScheduleId
```http
GET /test/api-appointment/appointment/getByScheduleId/{appointmentId}
```

## Troubleshooting

### Problemas Comunes

1. **Error de conexión a BD**: Verificar que las variables de entorno estén correctamente configuradas
2. **Puerto ocupado**: El puerto 3000 está en uso, cambiar en `serverless.yml` o cerrar el proceso
3. **Permisos de AWS**: Asegurarse de que las credenciales de AWS estén configuradas correctamente

### Logs en Desarrollo Local

```bash
serverless offline --stage test --verbose
```

### Logs en AWS

```bash
serverless logs -f main --stage test --tail
```


## Contacto

Para soporte técnico o preguntas, contactas con robertlyucra@gmail.com