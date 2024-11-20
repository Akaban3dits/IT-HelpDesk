import pool from '../config/db.js';

class Ticket {
    async create(ticketData) {
        try {
            const {
                friendly_code,
                title,
                description,
                status_id,
                priority_id,
                device_id,
                assigned_user_id,
                department_id,
                created_by,
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
                    updated_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                [
                    friendly_code,
                    title,
                    description,
                    status_id,
                    priority_id,
                    device_id,
                    assigned_user_id,
                    department_id,
                    created_by,
                    updated_by
                ]
            );

            return result.rows[0];
        } catch (error) {
            throw error; // Lanzar el error para que el controlador lo capture
        }
    }

    async delete(ticketId) {
        try {
            await pool.query('DELETE FROM tickets WHERE id = $1', [ticketId]);
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
                 LEFT JOIN users u1 ON t.created_by = u1.id
                 LEFT JOIN users u2 ON t.updated_by = u2.id
                 LEFT JOIN users u3 ON t.assigned_user_id = u3.id
                 LEFT JOIN devices d ON t.device_id = d.id
                 LEFT JOIN status s ON t.status_id = s.id
                 LEFT JOIN priority p ON t.priority_id = p.id
                 LEFT JOIN departments dp ON t.department_id = dp.id
                 WHERE t.id = $1`,
                [ticketId]
            );

            return result.rows[0] || null;
        } catch (error) {
            throw error; // Lanzar el error para que el controlador lo capture
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
        dateRange = ''  // Nuevo parámetro de rango de fechas
    ) {
        try {
            const offset = (page - 1) * limit;
            let query = `SELECT tickets.id, tickets.friendly_code, tickets.title, tickets.created_at, 
                     CONCAT(users.first_name, ' ', users.last_name) AS created_by_name, 
                     status.status_name, priority.priority_name 
                     FROM tickets
                     LEFT JOIN status ON tickets.status_id = status.id
                     LEFT JOIN priority ON tickets.priority_id = priority.id
                     LEFT JOIN users ON tickets.created_by = users.id`;

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
                    users.first_name ILIKE $${index} OR 
                    users.last_name ILIKE $${index}
                )`);
                    const termParam = `%${term}%`;
                    queryParams.push(termParam);
                    countQueryParams.push(termParam);
                    index++;
                });
            }

            // Filtro de columna específica
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
            if (dateRange) {
                if (dateRange === 'Hoy') {
                    whereConditions.push(`DATE(tickets.created_at) = CURRENT_DATE`);
                } else if (dateRange === 'Ultimos 2 dias') {
                    whereConditions.push(`tickets.created_at >= CURRENT_DATE - INTERVAL '2 days'`);
                } else if (dateRange === 'Ultimos 3 dias') {
                    whereConditions.push(`tickets.created_at >= CURRENT_DATE - INTERVAL '3 days'`);
                }
            }

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
                          LEFT JOIN users ON tickets.created_by = users.id`;

            if (whereConditions.length > 0) {
                countQuery += ` WHERE ` + whereConditions.join(` AND `);
            }

            const totalTicketsResult = await pool.query(countQuery, countQueryParams);
            const totalTickets = parseInt(totalTicketsResult.rows[0].count, 10);
            const totalPages = Math.ceil(totalTickets / limit);

            tickets = tickets.map(ticket => ({
                friendly_code: ticket.friendly_code,
                title: ticket.title,
                created_at: ticket.created_at,
                created_by_name: ticket.created_by_name,
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
            throw error;
        }
    }


    async findByFriendlyCode(friendlyCode) {
        const result = await pool.query(
            `SELECT 
                t.id, 
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
                    'id', u3.id,
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
             LEFT JOIN users u1 ON t.created_by = u1.id
             LEFT JOIN users u2 ON t.updated_by = u2.id
             LEFT JOIN users u3 ON t.assigned_user_id = u3.id
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
                    t.id, 
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
                 LEFT JOIN users u ON t.assigned_user_id = u.id
                 WHERE t.friendly_code = $1
                 LIMIT 1`,
                [friendlyCode]
            );
    
            return result.rows[0] || null; // Devuelve el ticket o null si no existe
        } catch (error) {
            throw error; // Lanza el error para que el controlador lo capture
        }
    }
    
    

}

export default new Ticket();
