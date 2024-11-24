
HelpDesk: Sistema de Gestión de Soporte Técnico

Este proyecto consiste en el desarrollo de una aplicación web para gestionar tickets de soporte técnico, diseñada para optimizar la comunicación entre usuarios y el equipo técnico en una organización. Utiliza tecnologías modernas como Node.js, React, y PostgreSQL, con una arquitectura basada en API RESTful.

Características principales

- Gestión de tickets:
  - Creación, visualización y actualización de tickets.
  - Seguimiento de estados, prioridades y comentarios asociados.
  - Historial detallado de cambios y actividades.

- Gestión de usuarios:
  - Registro y autenticación de usuarios mediante JWT.
  - Roles de usuario con permisos personalizados (usuarios, administradores, etc.).
  - Administración de cuentas y contraseñas.

- Notificaciones:
  - Actualizaciones en tiempo real sobre cambios en los tickets.
  - Panel de notificaciones organizado.

- Soporte para comentarios jerárquicos:
  - Comentarios y respuestas organizados en una estructura jerárquica.

- Dashboard administrativo:
  - Visualización de métricas y estadísticas de tickets.
  - Filtros avanzados para búsqueda de tickets.

Requisitos del sistema

- Backend:
  - Node.js (v16+)
  - PostgreSQL (v13+)
  - Librerías:
    - Express
    - Sequelize
    - JWT

- Frontend:
  - React (v18+)
  - TailwindCSS
  - Librerías adicionales:
    - Axios
    - React-Router-DOM

Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/HelpDesk.git
   cd HelpDesk
   ```

2. Instala las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=helpdesk
   JWT_SECRET=tu_secreto
   ```

4. Inicia el servidor backend:
   ```bash
   npm start
   ```

5. Instala las dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

6. Inicia el servidor frontend:
   ```bash
   npm start
   ```

Uso

1. Accede a la aplicación desde `http://localhost:3000`.
2. Regístrate o inicia sesión con una cuenta existente.
3. Explora las funcionalidades:
   - Crea tickets en la sección de soporte.
   - Gestiona usuarios y roles desde el panel administrativo.
   - Recibe notificaciones en tiempo real sobre cambios en los tickets.

Arquitectura

El sistema utiliza una arquitectura cliente-servidor con una API RESTful para comunicar el frontend y el backend. La base de datos está normalizada siguiendo las mejores prácticas para garantizar la consistencia e integridad de los datos.
