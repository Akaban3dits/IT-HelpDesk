import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar identificadores únicos

class User {
    async getUsers(page = 1, limit = 10, search = '', filterColumn = '', filterValue = '', sortBy = 'id', sortDirection = 'ASC', status = '', role_name = '') {
        try {
    
            // Asegurarse de que la página sea al menos 1
            page = Math.max(1, page);
    
            const offset = (page - 1) * limit;
            let query = `
                SELECT users.id, users.friendly_code, users.first_name, users.last_name, users.email, users.phone_number, users.status, users.company,
                       roles.role_name, departments.department_name
                FROM users
                LEFT JOIN roles ON users.role_id = roles.id
                LEFT JOIN departments ON users.department_id = departments.id
            `;
            let queryParams = [];
            let whereConditions = [];
            let index = 1;
    
            // Búsqueda en múltiples columnas, manejando múltiples palabras
            if (search) {
                const searchTerms = search.split(' ');
                searchTerms.forEach(term => {
                    whereConditions.push(`(
                        users.first_name ILIKE $${index} OR 
                        users.last_name ILIKE $${index} OR 
                        users.email ILIKE $${index} OR 
                        users.phone_number ILIKE $${index} OR
                        users.friendly_code ILIKE $${index}
                    )`);
                    queryParams.push(`%${term}%`);
                    index++;
                });
            }
    
            // Filtro por columna específica
            if (filterColumn && filterValue) {
                whereConditions.push(`${filterColumn} = $${index}`);
                queryParams.push(filterValue);
                index++;
            }
    
            // Filtro por estado (status)
            if (typeof status === 'boolean') {
                whereConditions.push(`users.status = $${index}`);
                queryParams.push(status);
                index++;
            }
    
            // Filtro por role_name (basado en la tabla `roles`)
            if (role_name) {
                whereConditions.push(`roles.role_name = $${index}`);
                queryParams.push(role_name);
                index++;
            }
    
            // Agregar condiciones WHERE si existen
            if (whereConditions.length > 0) {
                query += ` WHERE ` + whereConditions.join(' AND ');
            }
    
            // Ordenar y paginar
            query += ` ORDER BY ${sortBy} ${sortDirection} LIMIT $${index} OFFSET $${index + 1}`;
            queryParams.push(limit, offset);
            // Ejecutar la consulta para obtener los usuarios
            const result = await pool.query(query, queryParams);
            let users = result.rows;

    
            // Consulta para obtener el total de usuarios después de aplicar los filtros
            let countQuery = `
                SELECT COUNT(*)
                FROM users
                LEFT JOIN roles ON users.role_id = roles.id
                LEFT JOIN departments ON users.department_id = departments.id
            `;
            if (whereConditions.length > 0) {
                countQuery += ` WHERE ` + whereConditions.join(' AND ');
            }
    
            const totalUsersResult = await pool.query(countQuery, queryParams.slice(0, whereConditions.length));
            const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);
            const totalPages = Math.ceil(totalUsers / limit);
    
            // Filtrar datos sensibles y formatear el resultado
            users = users.map(user => {
                const { id, friendly_code, first_name, last_name, email, phone_number, status, company, role_name, department_name } = user;
                return {
                    id,
                    friendly_code,
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    status,
                    company,
                    role_name,
                    department_name
                };
            });
    
            return {
                current_page: page,
                total_pages: totalPages,
                total_users: totalUsers,
                users: users
            };
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error.message);
            throw error;
        }
    }
    



    async countUsers() {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        return result.rows[0].count;
    }

    async getUserByFriendlyCode(friendly_code) {
        const result = await pool.query(`
            SELECT 
                id, 
                friendly_code, 
                first_name, 
                last_name, 
                email, 
                phone_number, 
                status, 
                company, 
                role_id, 
                department_id 
            FROM users 
            WHERE friendly_code = $1
        `, [friendly_code]);
        return result.rows[0];
    }
    

    async getUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async generateFriendlyCode() {
        const datePart = new Date().toISOString().replace(/[-:.TZ]/g, ''); // Parte de la fecha
        const randomPart = uuidv4().split('-')[0]; // Parte aleatoria
        return `${datePart}-${randomPart}`; // Combina ambos para generar el friendly_code
    }

    async createUser({ first_name, last_name, email, password, phone_number, status, company, role_id, department_id }) {
        // Generar el friendly_code
        const friendly_code = await this.generateFriendlyCode();

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (friendly_code, first_name, last_name, email, password, phone_number, status, company, role_id, department_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [friendly_code, first_name, last_name, email, hashedPassword, phone_number, status, company, role_id, department_id]
        );
        return result.rows[0];
    }

    async updateUser(friendly_code, { first_name, last_name, email, phone_number, status, company, role_id, department_id }) {
        const result = await pool.query(
            `UPDATE users SET 
                first_name = $1,
                last_name = $2,
                email = $3,
                phone_number = $4,
                status = $5,
                company = $6,
                role_id = $7,
                department_id = $8
            WHERE 
                friendly_code = $9 RETURNING *`,
            [first_name, last_name, email, phone_number, status, company, role_id, department_id, friendly_code]
        );
        return result.rows[0];
    }
    

    async validatePassword(storedPassword, providedPassword) {
        return await bcrypt.compare(providedPassword, storedPassword);
    }

    async deleteUser(friendly_code) {
        try {
            const result = await pool.query(
                'UPDATE users SET status = false WHERE friendly_code = $1 RETURNING *',
                [friendly_code]
            );

            // Verificamos si el usuario fue encontrado y actualizado
            if (result.rowCount === 0) {
                return null;  // Si no se encuentra el usuario
            }

            return result.rows[0];  // Retorna el usuario actualizado
        } catch (error) {
            console.error('Error al realizar el borrado lógico del usuario:', error.message);
            throw error;  // Lanza el error para que sea manejado por el controlador o servicio
        }
    }


}

export default new User();
