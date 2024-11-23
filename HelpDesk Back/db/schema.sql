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
    friendly_code TEXT PRIMARY KEY,
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
    updated_by TEXT REFERENCES users (friendly_code)
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

-- Tabla de tipos de dispositivos con siglas
CREATE TABLE IF NOT EXISTS device_types (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_name TEXT NOT NULL,
    type_code TEXT NOT NULL UNIQUE
);

-- Tabla de dispositivos referenciando el ID de device_types
CREATE TABLE IF NOT EXISTS devices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    device_name TEXT NOT NULL,
    device_type_id BIGINT NOT NULL REFERENCES device_types (id)
);

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
    friendly_code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    status_id BIGINT NOT NULL REFERENCES status (id),
    priority_id BIGINT REFERENCES priority (id),
    device_id BIGINT REFERENCES devices (id) ON DELETE SET NULL,
    assigned_user_id TEXT REFERENCES users (friendly_code) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments (id) ON DELETE SET NULL, 
    parent_ticket_id TEXT REFERENCES tickets (friendly_code),
    created_by TEXT REFERENCES users (friendly_code) ON DELETE SET NULL,
    created_by_name TEXT,
    updated_by TEXT REFERENCES users (friendly_code) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id TEXT NOT NULL REFERENCES tickets (friendly_code),
    user_id TEXT NOT NULL REFERENCES users (friendly_code),
    parent_comment_id BIGINT REFERENCES comments (id)
);

-- Tabla de adjuntos
CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    file_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id TEXT NOT NULL REFERENCES tickets (friendly_code),
    is_image BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla de historial de estado de tickets
CREATE TABLE IF NOT EXISTS status_history (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    old_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    ticket_id TEXT NOT NULL REFERENCES tickets (friendly_code),
    changed_by_user_id TEXT NOT NULL REFERENCES users (friendly_code)
);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task_description TEXT NOT NULL,
    assigned_to_user_id TEXT NOT NULL REFERENCES users (friendly_code),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_id TEXT NOT NULL REFERENCES tickets (friendly_code)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id TEXT REFERENCES tickets (friendly_code)
);

-- Relación entre notificaciones y usuarios
CREATE TABLE IF NOT EXISTS notification_user (
    notification_id BIGINT NOT NULL REFERENCES notifications (id),
    user_id TEXT NOT NULL REFERENCES users (friendly_code),
    read_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (notification_id, user_id)
);

INSERT INTO roles (role_name) VALUES ('Usuario');
INSERT INTO roles (role_name) VALUES ('Administrador');
INSERT INTO roles (role_name) VALUES ('Observador');
INSERT INTO roles (role_name) VALUES ('Superadministrador');


INSERT INTO departments (department_name) VALUES ('Soporte Técnico');
INSERT INTO departments (department_name) VALUES ('Desarrollo');
INSERT INTO departments (department_name) VALUES ('Recursos Humanos');

INSERT INTO status (status_name) VALUES ('Abierto');
INSERT INTO status (status_name) VALUES ('Cerrado');
INSERT INTO status (status_name) VALUES ('En Progreso');
INSERT INTO status (status_name) VALUES ('Pendiente');


INSERT INTO priority (priority_name) VALUES ('Alta');
INSERT INTO priority (priority_name) VALUES ('Media');
INSERT INTO priority (priority_name) VALUES ('Baja');


INSERT INTO device_types (type_name, type_code) VALUES ('Hardware', 'HDW');
INSERT INTO device_types (type_name, type_code) VALUES ('Periférico', 'PRF');
INSERT INTO device_types (type_name, type_code) VALUES ('Software', 'SFT');


INSERT INTO devices (device_name, device_type_id)
VALUES ('Laptop', (SELECT id FROM device_types WHERE type_code = 'HDW'));

INSERT INTO devices (device_name, device_type_id)
VALUES ('Teléfono', (SELECT id FROM device_types WHERE type_code = 'HDW'));

INSERT INTO devices (device_name, device_type_id)
VALUES ('Router', (SELECT id FROM device_types WHERE type_code = 'PRF'));

INSERT INTO devices (device_name, device_type_id)
VALUES ('Impresora', (SELECT id FROM device_types WHERE type_code = 'PRF'));
