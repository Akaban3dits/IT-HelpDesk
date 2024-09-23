-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name TEXT NOT NULL
);

-- Tabla de departamentos
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    department_name TEXT NOT NULL
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    friendly_code TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    company BOOLEAN NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles (id),
    department_id BIGINT NOT NULL REFERENCES departments (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by BIGINT REFERENCES users (id) -- Puede ser nulo inicialmente
);

-- Tabla de estados
CREATE TABLE IF NOT EXISTS status (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    status_name TEXT NOT NULL
);

-- Tabla de prioridades
CREATE TABLE IF NOT EXISTS priority (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    priority_name TEXT NOT NULL
);

-- Tabla de dispositivos
CREATE TABLE IF NOT EXISTS devices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    device_name TEXT NOT NULL
);

-- Tabla de tickets (con campo 'title')
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    friendly_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL, -- Nuevo campo para el título del ticke
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE, -- Puede ser nulo si el ticket no está cerrado
    description TEXT NOT NULL,
    status_id BIGINT NOT NULL REFERENCES status (id),
    priority_id BIGINT NOT NULL REFERENCES priority (id),
    device_id BIGINT NOT NULL REFERENCES devices (id),
    assigned_user_id BIGINT NOT NULL REFERENCES users (id),
    department_id BIGINT NOT NULL REFERENCES departments (id),
    parent_ticket_id BIGINT REFERENCES tickets (id), -- Puede ser nulo si no hay jerarquía de tickets
    created_by BIGINT NOT NULL REFERENCES users (id),
    updated_by BIGINT REFERENCES users (id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id BIGINT NOT NULL REFERENCES tickets (id),
    user_id BIGINT NOT NULL REFERENCES users (id),
    parent_comment_id BIGINT REFERENCES comments (id) -- Puede ser nulo si no es una respuesta
);

-- Tabla de adjuntos
CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    file_path TEXT NOT NULL, -- Ruta del archivo
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id BIGINT NOT NULL REFERENCES tickets (id)
);

-- Tabla de historial de estado de tickets
CREATE TABLE IF NOT EXISTS status_history (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    old_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    ticket_id BIGINT NOT NULL REFERENCES tickets (id),
    changed_by_user_id BIGINT NOT NULL REFERENCES users (id)
);

-- Tabla de tareas (ahora con campo booleano 'is_completed')
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task_description TEXT NOT NULL,
    assigned_to_user_id BIGINT NOT NULL REFERENCES users (id),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE, -- Campo booleano para indicar si la tarea está completada
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_id BIGINT NOT NULL REFERENCES tickets (id)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id BIGINT REFERENCES tickets (id) -- Puede ser nulo si la notificación no es de un ticket
);

-- Relación entre notificaciones y usuarios
CREATE TABLE IF NOT EXISTS notification_user (
    notification_id BIGINT NOT NULL REFERENCES notifications (id),
    user_id BIGINT NOT NULL REFERENCES users (id),
    read_at TIMESTAMP WITH TIME ZONE, -- Puede ser nulo si la notificación no ha sido leída
    PRIMARY KEY (notification_id, user_id)
);

-- Insertar roles
INSERT INTO roles (role_name)
SELECT 'Usuario'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Usuario');

INSERT INTO roles (role_name)
SELECT 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Administrador');

INSERT INTO roles (role_name)
SELECT 'Observador'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Observador');

INSERT INTO roles (role_name)
SELECT 'Superadministrador'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Superadministrador');

-- Insertar departamentos
INSERT INTO departments (department_name)
SELECT 'Soporte Técnico'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Soporte Técnico');

INSERT INTO departments (department_name)
SELECT 'Desarrollo'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Desarrollo');

INSERT INTO departments (department_name)
SELECT 'Recursos Humanos'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Recursos Humanos');

-- Insertar estados
INSERT INTO status (status_name)
SELECT 'Abierto'
WHERE NOT EXISTS (SELECT 1 FROM status WHERE status_name = 'Abierto');

INSERT INTO status (status_name)
SELECT 'Cerrado'
WHERE NOT EXISTS (SELECT 1 FROM status WHERE status_name = 'Cerrado');

INSERT INTO status (status_name)
SELECT 'En Progreso'
WHERE NOT EXISTS (SELECT 1 FROM status WHERE status_name = 'En Progreso');

INSERT INTO status (status_name)
SELECT 'Pendiente'
WHERE NOT EXISTS (SELECT 1 FROM status WHERE status_name = 'Pendiente');

-- Insertar prioridades
INSERT INTO priority (priority_name)
SELECT 'Alta'
WHERE NOT EXISTS (SELECT 1 FROM priority WHERE priority_name = 'Alta');

INSERT INTO priority (priority_name)
SELECT 'Media'
WHERE NOT EXISTS (SELECT 1 FROM priority WHERE priority_name = 'Media');

INSERT INTO priority (priority_name)
SELECT 'Baja'
WHERE NOT EXISTS (SELECT 1 FROM priority WHERE priority_name = 'Baja');

-- Insertar dispositivos
INSERT INTO devices (device_name)
SELECT 'Laptop'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Laptop');

INSERT INTO devices (device_name)
SELECT 'Teléfono'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Teléfono');

INSERT INTO devices (device_name)
SELECT 'Router'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Router');

INSERT INTO devices (device_name)
SELECT 'Impresora'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Impresora');
