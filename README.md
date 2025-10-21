# Sistema de Gestión de Transacciones y Usuarios

## Descripción

Este proyecto es una aplicación web fullstack construida con Next.js, Prisma, y PostgreSQL que permite gestionar usuarios y transacciones financieras. El sistema implementa autenticación de usuarios, gestión de transacciones, y generación de reportes con diferentes niveles de acceso según el rol del usuario.

## Demo

Puedes ver la aplicación en funcionamiento aquí: https://prueba-tecnica-fullstack-daniela-vl.vercel.app

### Página Principal
![Página Principal](./assets/home.png)
Panel principal con acceso a todas las funcionalidades del sistema.

### Gestión de Transacciones
![Gestión de Transacciones](./assets/transactions.png)
Vista de todos los movimientos financieros con opciones para agregar, editar y eliminar.

### Formulario de Movimientos
![Formulario de Movimientos](./assets/transaction-form.png)
Interfaz para agregar nuevos ingresos y egresos.

### Reportes Financieros
![Reportes](./assets/reports.png)
Visualización gráfica de los movimientos y saldo actual con opción de descarga CSV.

### Gestión de Usuarios
![Usuarios](./assets/users.png)
Administración de usuarios y sus roles en el sistema.

### Documentación API
![API Docs](./assets/api-docs.png)
Documentación completa de todos los endpoints con Swagger UI.

## Características Principales

- Autenticación de usuarios con NextAuth.js y GitHub
- Visualización de datos con Chart.js y Recharts
- Base de datos PostgreSQL con Prisma ORM
- Diseño con TailwindCSS y Shadcn/ui
- Documentación API con Swagger
- Testing con Jest

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL instalado localmente o una base de datos PostgreSQL en Supabase
- npm o yarn
- Cuenta en GitHub para autenticación

## Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/DanielaVL/prueba-tecnica-fullstack-DanielaVL.git
   cd prueba-tecnica-fullstack-DanielaVL
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
   
   # NextAuth
   NEXTAUTH_SECRET="tu_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # GitHub OAuth
   GITHUB_ID="tu_github_client_id"
   GITHUB_SECRET="tu_github_client_secret"
   ```

4. **Configurar la base de datos**
   ```bash
   # Ejecutar migraciones de Prisma
   npx prisma migrate dev
   # Generar cliente de Prisma
   npx prisma generate
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
├── __tests__/          # Tests unitarios
├── components/         # Componentes React reutilizables
├── lib/               # Utilidades y configuraciones
├── pages/             # Rutas de la aplicación
├── prisma/            # Schema y migraciones de base de datos
├── public/            # Archivos estáticos
├── styles/            # Estilos globales
└── types/             # Definiciones de tipos TypeScript
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm test` - Ejecuta los tests

## Despliegue en Vercel

1. **Preparación para el despliegue**
   - Asegúrate de tener una cuenta en [Vercel](https://vercel.com)
   - Ten a mano las variables de entorno necesarias

2. **Pasos para el despliegue**

  **Usando la interfaz web de Vercel**:
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno en los ajustes del proyecto:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `GITHUB_ID`
     - `GITHUB_SECRET`
   - Vercel detectará automáticamente que es un proyecto Next.js y lo desplegará

3. **Post-despliegue**
   - Ejecuta las migraciones en la base de datos de producción
   - Verifica que la autenticación con GitHub funcione correctamente
   - Revisa los logs en el dashboard de Vercel

## Endpoints de la API

La documentación completa de la API está disponible en `/api-docs` cuando el servidor está en ejecución. Los principales endpoints incluyen:

- `/api/auth/*` - Endpoints de autenticación
- `/api/users` - Gestión de usuarios
- `/api/transactions` - Gestión de transacciones
- `/api/reports` - Generación de reportes

## Roles y Permisos

- **ADMIN**: Acceso completo a todas las funcionalidades
  - Gestión de usuarios
  - Gestión de transacciones
  - Visualización de reportes
  - Descarga de informes CSV

- **USUARIO**: Acceso limitado
  - Visualización de transacciones propias
  - Creación de nuevas transacciones

## Testing

Los tests están escritos usando Jest y React Testing Library. Para ejecutar los tests:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

Los tests cubren:
- Funcionalidad de transacciones
- Gestión de usuarios
- Generación de reportes

## Configuración de Base de Datos

El proyecto usa PostgreSQL con Prisma como ORM. El schema de la base de datos incluye:

- Modelos de autenticación (User, Session, Account)
- Modelos de negocio (Movimiento)
- Enums para roles y tipos de movimientos

## Autora 👩‍💻

Daniela Vásquez Londoño - Desarrolladora Fullstack
- GitHub: [@DanielaVL](https://github.com/DanielaVL)
