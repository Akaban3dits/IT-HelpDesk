import pool from '../config/db.js';

class Ticket {
    async create(ticketData) {
        try {
            const {
                friendly_code,
                title,
                description,
                status_id,
                priority_id = null,
                device_id,
                assigned_user_id = null,
                department_id,
                created_by,
                created_by_name,
                updated_by
            } = ticketData;

            const result = await pool.query(
                `INSERT INTO tickets (
                    friendly_code,
                    title,
                    description,
                    status_id,
                    priority_id,
                    device_id,
                    assigned_user_id,
                    department_id,
                    created_by,
                    created_by_name,
                    updated_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [
                    friendly_code,
                    title,
                    description,
                    status_id,
                    priority_id || null, // Convertir vacío a null
                    device_id,
                    assigned_user_id || null, // Convertir vacío a null
                    department_id,
                    created_by,
                    created_by_name,
                    updated_by
                ]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error en create:', error.message);
            throw new Error('Error al crear el ticket: ' + error.message);
        }
    }
    async delete(ticketId) {
        try {
            await pool.query('DELETE FROM tickets WHERE friendly_code = $1', [ticketId]);
        } catch (error) {
            throw error; // Lanzar el error para que el controlador lo capture
        }
    }

    async findById(ticketId) {
        try {
            const result = await pool.query(
                `SELECT t.*, 
                        u1.friendly_code as created_by_code,
                        u2.friendly_code as updated_by_code,
                        u3.friendly_code as assigned_user_code,
                        d.device_name,
                        s.status_name,
                        p.priority_name,
                        dp.department_name
                 FROM tickets t
                 LEFT JOIN users u1 ON t.created_by = u1.friendly_code
                 LEFT JOIN users u2 ON t.updated_by = u2.friendly_code
                 LEFT JOIN users u3 ON t.assigned_user_id = u3.friendly_code
                 LEFT JOIN devices d ON t.device_id = d.id
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN priority p ON t.priority_id = p.id
                 LEFT JOIN departments dp ON t.department_id = dp.id
                 WHERE t.friendly_code = $1`,
                [ticketId]
            );

            return result.rows[0] || null;
        } catch (error) {
            console.error('Error en findById:', error.message);
            throw error; // Re-lanza el error
        }
    }


    // Modelo
    async gettickets(
        page = 1,
        limit = 10,
        search = '',
        filterColumn = '',
        filterValue = '',
        sortBy = 'created_at',
        sortDirection = 'desc',
        status = '',
        priority = '',
        dateOption = '',
        isAssigned = null,
        createdBy // ID del usuario
    ) {
        try {
            const offset = (page - 1) * limit;
            let query = `SELECT 
                            tickets.friendly_code, 
                            tickets.title, 
                            tickets.created_at, 
                            CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name, 
                            CONCAT(assigned.first_name, ' ', assigned.last_name) AS assigned_to_name, 
                            status.status_name, 
                            priority.priority_name 
                        FROM tickets
                        LEFT JOIN status ON tickets.status_id = status.id
                        LEFT JOIN priority ON tickets.priority_id = priority.id
                        LEFT JOIN users AS creator ON tickets.created_by = creator.friendly_code
                        LEFT JOIN users AS assigned ON tickets.assigned_user_id = assigned.friendly_code`;
    
            let queryParams = [];
            let countQueryParams = [];
            let whereConditions = [];
            let index = 1;
    
            // Filtro de búsqueda
            if (search) {
                const searchTerms = search.split(' ');
                searchTerms.forEach(term => {
                    whereConditions.push(`(
                        tickets.friendly_code ILIKE $${index} OR
                        tickets.title ILIKE $${index} OR
                        creator.first_name ILIKE $${index} OR 
                        creator.last_name ILIKE $${index}
                    )`);
                    const termParam = `%${term}%`;
                    queryParams.push(termParam);
                    countQueryParams.push(termParam);
                    index++;
                });
            }
    
            // Filtro por columna específica
            if (filterColumn && filterValue) {
                whereConditions.push(`${filterColumn} = $${index}`);
                queryParams.push(filterValue);
                countQueryParams.push(filterValue);
                index++;
            }
    
            // Filtro por estado
            if (status) {
                whereConditions.push(`status.status_name = $${index}`);
                queryParams.push(status);
                countQueryParams.push(status);
                index++;
            }
    
            // Filtro por prioridad
            if (priority) {
                whereConditions.push(`priority.priority_name = $${index}`);
                queryParams.push(priority);
                countQueryParams.push(priority);
                index++;
            }
    
            // Filtro por rango de fecha
            if (dateOption) {
                if (dateOption === 'Hoy') {
                    whereConditions.push(`DATE(tickets.created_at) = CURRENT_DATE`);
                } else if (dateOption === 'Ultimos 2 dias') {
                    whereConditions.push(`tickets.created_at >= CURRENT_DATE - INTERVAL '2 days'`);
                } else if (dateOption === 'Ultimos 3 dias') {
                    whereConditions.push(`tickets.created_at >= CURRENT_DATE - INTERVAL '3 days'`);
                }
            }
    
            // Filtro por `isAssigned` y `createdBy`
            if (isAssigned !== null) {
    
                if (isAssigned === true || isAssigned === 'true') {
                    whereConditions.push(`tickets.assigned_user_id = $${index}`);
                } else if (isAssigned === false || isAssigned === 'false') {
                    whereConditions.push(`tickets.created_by = $${index}`);
                } else {
                }
    
                queryParams.push(createdBy);
                countQueryParams.push(createdBy);
                index++;
            }
    
            // Agregar condiciones WHERE si existen
            if (whereConditions.length > 0) {
                query += ` WHERE ` + whereConditions.join(` AND `);
            }
    
            query += ` ORDER BY ${sortBy} ${sortDirection} LIMIT $${index} OFFSET $${index + 1}`;
            queryParams.push(limit, offset);
            const result = await pool.query(query, queryParams);
    
            let tickets = result.rows;
    
            // Consulta para el conteo total de tickets
            let countQuery = `SELECT COUNT(*) 
                              FROM tickets 
                              LEFT JOIN status ON tickets.status_id = status.id
                              LEFT JOIN priority ON tickets.priority_id = priority.id
                              LEFT JOIN users AS creator ON tickets.created_by = creator.friendly_code
                              LEFT JOIN users AS assigned ON tickets.assigned_user_id = assigned.friendly_code`;
    
            if (whereConditions.length > 0) {
                countQuery += ` WHERE ` + whereConditions.join(` AND `);
            }
    
            const totalTicketsResult = await pool.query(countQuery, countQueryParams);
    
            const totalTickets = parseInt(totalTicketsResult.rows[0]?.count || 0, 10);
            const totalPages = Math.ceil(totalTickets / limit);
    
            // Asegurarse de incluir el campo `assigned_to_name`
            tickets = tickets.map(ticket => ({
                friendly_code: ticket.friendly_code,
                title: ticket.title,
                created_at: ticket.created_at,
                created_by_name: ticket.created_by_name,
                assigned_to_name: ticket.assigned_to_name, // Incluye el campo del usuario asignado
                status_name: ticket.status_name,
                priority_name: ticket.priority_name
            }));
    
            return {
                current_page: page,
                total_pages: totalPages,
                total_tickets: totalTickets,
                tickets
            };
        } catch (error) {
            console.error('Error en gettickets:', error);
            throw error;
        }
    }
    



    async findByFriendlyCode(friendlyCode) {
        const result = await pool.query(
            `SELECT 
                t.friendly_code, 
                t.title, 
                t.description, 
                t.created_at, 
                t.closed_at, 
                json_build_object(
                    'first_name', u1.first_name,
                    'last_name', u1.last_name
                ) AS created_by,
                json_build_object(
                    'id', u3.friendly_code,
                    'first_name', u3.first_name,
                    'last_name', u3.last_name
                ) AS assigned_user,
                json_build_object(
                    'status_name', s.status_name
                ) AS status,
                json_build_object(
                    'priority_name', p.priority_name
                ) AS priority,
                json_build_object(
                    'department_name', dp.department_name
                ) AS department,
                json_build_object(
                    'device_name', d.device_name,
                    'device_type', json_build_object(
                        'type_name', dt.type_name
                    )
                ) AS device
             FROM tickets t
             LEFT JOIN users u1 ON t.created_by = u1.friendly_code
             LEFT JOIN users u2 ON t.updated_by = u2.friendly_code
             LEFT JOIN users u3 ON t.assigned_user_id = u3.friendly_code
             LEFT JOIN devices d ON t.device_id = d.id
             LEFT JOIN device_types dt ON d.device_type_id = dt.id
             LEFT JOIN status s ON t.status_id = s.id
             LEFT JOIN priority p ON t.priority_id = p.id
             LEFT JOIN departments dp ON t.department_id = dp.id
             WHERE t.friendly_code = $1`,
            [friendlyCode]
        );

        return result.rows[0] || null; // Devuelve el ticket o null si no existe
    }


    async getMonthlyTicketCounts() {
        try {
            const query = `
                SELECT 
                    TO_CHAR(t.created_at, 'YYYY-MM') AS year_month,
                    TO_CHAR(t.created_at, 'Month') AS month_name,
                    COUNT(*) AS total_tickets
                FROM 
                    tickets t
                WHERE 
                    t.created_at >= NOW() - INTERVAL '1 year'
                GROUP BY 
                    year_month, month_name
                ORDER BY 
                    year_month;
            `;
            const result = await pool.query(query);

            return result.rows.map(row => ({
                year_month: row.year_month,
                month_name: row.month_name.trim(), // Elimina espacios en blanco de los nombres de mes
                total_tickets: parseInt(row.total_tickets, 10)
            }));
        } catch (error) {
            throw error; // Lanza el error para que el controlador lo capture
        }
    }

    async getDailyTicketStatusCounts() {
        try {
            const query = `
                SELECT 
                    s.status_name AS status,
                    COUNT(*) AS total_tickets
                FROM 
                    tickets t
                LEFT JOIN 
                    status s ON t.status_id = s.id
                WHERE 
                    DATE(t.created_at) = CURRENT_DATE
                GROUP BY 
                    s.status_name
                ORDER BY 
                    s.status_name;
            `;
            const result = await pool.query(query);

            return result.rows.map(row => ({
                status: row.status,
                total_tickets: parseInt(row.total_tickets, 10)
            }));
        } catch (error) {
            throw error;
        }
    }

    async updateByFriendlyCode(friendlyCode, { status_id, priority_id, assigned_user_id, updated_by, updated_at, closed_at }) {
        try {
            const result = await pool.query(
                `UPDATE tickets
                 SET status_id = $1,
                     priority_id = $2,
                     assigned_user_id = $3,
                     updated_by = $4,
                     updated_at = $5,
                     closed_at = $6
                 WHERE friendly_code = $7
                 RETURNING *`,
                [status_id, priority_id, assigned_user_id, updated_by, updated_at, closed_at, friendlyCode]
            );

            return result.rows[0];
        } catch (error) {
            throw error; // Lanzar el error para que el controlador lo capture
        }
    }

    async getTicketByFriendlyCode(friendlyCode) {
        try {
            const result = await pool.query(
                `SELECT 
                    t.friendly_code, 
                    t.title, 
                    t.description, 
                    t.created_at, 
                    t.closed_at, 
                    t.status_id,
                    t.priority_id,
                    t.device_id,
                    t.assigned_user_id,
                    t.department_id,
                    t.created_by,
                    t.updated_by,
                    t.updated_at,
                    s.status_name,
                    p.priority_name,
                    d.device_name,
                    u.first_name AS assigned_user_first_name,
                    u.last_name AS assigned_user_last_name
                 FROM tickets t
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN priority p ON t.priority_id = p.id
                 LEFT JOIN devices d ON t.device_id = d.id
                 LEFT JOIN users u ON t.assigned_user_id = u.friendly_code
                 WHERE t.friendly_code = $1
                 LIMIT 1`,
                [friendlyCode]
            );

            return result.rows[0] || null; // Devuelve el ticket o null si no existe
        } catch (error) {
            throw error; // Lanza el error para que el controlador lo capture
        }
    }

    async getTicketDetailsByFriendlyCode(friendlyCode) {
        try {
            const query = `
                SELECT 
                    t.friendly_code,
                    t.created_by,
                    t.assigned_user_id
                FROM tickets t
                WHERE t.friendly_code = $1
                LIMIT 1`;
            const result = await pool.query(query, [friendlyCode]);
            return result.rows[0] || null; // Retorna los detalles del ticket
        } catch (error) {
            console.error('Error al obtener el ticket:', error.message);
            throw new Error('Error al obtener el ticket: ' + error.message);
        }
    }

}

export default new Ticket();
