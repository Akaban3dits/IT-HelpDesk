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

-- Tabla de tipos de dispositivos
CREATE TABLE IF NOT EXISTS device_types (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_name TEXT NOT NULL
);

-- Tabla de dispositivos con la referencia a tipos de dispositivos
CREATE TABLE IF NOT EXISTS devices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    device_name TEXT NOT NULL,
    device_type_id BIGINT REFERENCES device_types (id)
);

-- Tabla de tickets (ajustes finales para el manejo de usuarios eliminados)
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    friendly_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE, -- Puede ser nulo si el ticket no está cerrado
    status_id BIGINT NOT NULL REFERENCES status (id),
    priority_id BIGINT REFERENCES priority (id), -- Puede ser nulo
    device_id BIGINT NOT NULL REFERENCES devices (id),
    assigned_user_id BIGINT REFERENCES users (id) ON DELETE SET NULL,
    department_id BIGINT NOT NULL REFERENCES departments (id),
    parent_ticket_id BIGINT REFERENCES tickets (id), -- Puede ser nulo si no hay jerarquía de tickets
    created_by BIGINT REFERENCES users (id) ON DELETE SET NULL,
    created_by_name TEXT, -- Almacenar el nombre del usuario que creó el ticket
    updated_by BIGINT REFERENCES users (id) ON DELETE SET NULL, -- Cambiado para manejar la eliminación del usuario que actualizó el ticket
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
    file_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id BIGINT NOT NULL REFERENCES tickets (id),
    is_image BOOLEAN NOT NULL DEFAULT FALSE
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

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task_description TEXT NOT NULL,
    assigned_to_user_id BIGINT NOT NULL REFERENCES users (id),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
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

-- Insertar tipos de dispositivos
INSERT INTO device_types (type_name)
SELECT 'Hardware'
WHERE NOT EXISTS (SELECT 1 FROM device_types WHERE type_name = 'Hardware');

INSERT INTO device_types (type_name)
SELECT 'Periférico'
WHERE NOT EXISTS (SELECT 1 FROM device_types WHERE type_name = 'Periférico');

INSERT INTO device_types (type_name)
SELECT 'Software'
WHERE NOT EXISTS (SELECT 1 FROM device_types WHERE type_name = 'Software');

-- Insertar dispositivos con los tipos de dispositivos
INSERT INTO devices (device_name, device_type_id)
SELECT 'Laptop', (SELECT id FROM device_types WHERE type_name = 'Hardware')
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Laptop');

INSERT INTO devices (device_name, device_type_id)
SELECT 'Teléfono', (SELECT id FROM device_types WHERE type_name = 'Hardware')
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Teléfono');

INSERT INTO devices (device_name, device_type_id)
SELECT 'Router', (SELECT id FROM device_types WHERE type_name = 'Periférico')
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Router');

INSERT INTO devices (device_name, device_type_id)
SELECT 'Impresora', (SELECT id FROM device_types WHERE type_name = 'Periférico')
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE device_name = 'Impresora');
