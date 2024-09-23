-- Tabla de Roles
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- Tabla de Departamentos
CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

-- Tabla de Tipos de Dispositivos
CREATE TABLE DeviceType (
    device_type_id SERIAL PRIMARY KEY,
    device_type_name VARCHAR(50) NOT NULL
);

-- Tabla de Estado de Tareas
CREATE TABLE TaskStatus (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

-- Tabla de Prioridades
CREATE TABLE Priority (
    priority_id SERIAL PRIMARY KEY,
    priority_name VARCHAR(50) NOT NULL
);

-- Tabla de Categorías
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

-- Tabla de Usuarios
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    friendly_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status BOOLEAN NOT NULL,
    company BOOLEAN NOT NULL,
    role_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- Tabla de Dispositivos
CREATE TABLE Devices (
    device_id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(50) NOT NULL,
    device_type_id INT NOT NULL,
    FOREIGN KEY (device_type_id) REFERENCES DeviceType(device_type_id)
);

-- Tabla de Tickets
CREATE TABLE Tickets (
    ticket_id SERIAL PRIMARY KEY,
    friendly_code VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP NULL,
    description TEXT NOT NULL,
    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    category_id INT NOT NULL,
    device_id INT NOT NULL,
    assigned_user_id INT NOT NULL,
    department_id INT NOT NULL,
    parent_ticket_id INT NULL,
    FOREIGN KEY (status_id) REFERENCES TaskStatus(status_id),
    FOREIGN KEY (priority_id) REFERENCES Priority(priority_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id),
    FOREIGN KEY (device_id) REFERENCES Devices(device_id),
    FOREIGN KEY (assigned_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (parent_ticket_id) REFERENCES Tickets(ticket_id)
);

-- Tabla de Historial de Estado
CREATE TABLE StatusHistory (
    history_id SERIAL PRIMARY KEY,
    changed_at TIMESTAMP NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
    FOREIGN KEY (changed_by_user_id) REFERENCES Users(user_id)
);

-- Tabla de Comentarios
CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    parent_comment_id INT NULL,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id)
);

-- Tabla de Archivos Adjuntos
CREATE TABLE Attachments (
    attachment_id SERIAL PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL,
    ticket_id INT NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
);

-- Tabla de Tareas
CREATE TABLE Tasks (
    task_id SERIAL PRIMARY KEY,
    task_description TEXT NOT NULL,
    assigned_to_user_id INT NOT NULL,
    status_id INT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    ticket_id INT NOT NULL,
    FOREIGN KEY (assigned_to_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (status_id) REFERENCES TaskStatus(status_id),
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
);

