import pool from '../config/db.js';

class Department {
    async findAll() {
        const result = await pool.query('SELECT * FROM departments');
        return result.rows;
    }
    async searchDepartments(search = '', limit = 6) {
        let query = 'SELECT * FROM departments';
        let queryParams = [];
        let whereConditions = [];
        let index = 1;

        // Búsqueda en el nombre del departamento
        if (search) {
            whereConditions.push(`department_name ILIKE $${index}`);
            queryParams.push(`%${search}%`);
            index++;
        }

        // Agregar condiciones WHERE si existen
        if (whereConditions.length > 0) {
            query += ` WHERE ` + whereConditions.join(' AND ');
        }

        // Limitar a 6 resultados
        query += ` LIMIT $${index}`;
        queryParams.push(limit);

        try {
            const result = await pool.query(query, queryParams);
            return result.rows;
        } catch (error) {
            throw new Error('Error al ejecutar la consulta: ' + error.message);
        }
    }

    async findById(department_id) {
        const result = await pool.query('SELECT * FROM departments WHERE department_id = $1', [department_id]);
        return result.rows[0];
    }

    async create(department_name) {
        const result = await pool.query('INSERT INTO departments (department_name) VALUES ($1) RETURNING *', [department_name]);
        return result.rows[0];
    }

    async update(department_id, department_name) {
        const result = await pool.query('UPDATE departments SET department_name = $1 WHERE department_id = $2 RETURNING *', [department_name, department_id]);
        return result.rows[0];
    }

    async delete(department_id) {
        const result = await pool.query('DELETE FROM departments WHERE department_id = $1 RETURNING *', [department_id]);
        return result.rows[0];
    }
}

export default new Department();
