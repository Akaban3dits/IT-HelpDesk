import pool from '../config/db.js';

class Department {
    //? Funcionalidades comprobadas

     async searchDepartments(search = '', limit = 6) {
        // Definir la consulta base y limitar la busqueda a 6 resultados
        let query = 'SELECT * FROM departments';
        // Array para almacenar los parámetros de consulta
        let queryParams = [];
        // Array para almacenar condiciones WHERE de la consulta
        let whereConditions = [];
        // Índice para los parámetros SQL
        let index = 1;

        // Búsqueda en el nombre del departamento
        if (search) {
            // Añade una condición WHERE que verifica coincidencias parciales (ILIKE) en el nombre del departamento
            whereConditions.push(`department_name ILIKE $${index}`);
            // Agregar el valor de búsqueda con comodines (%) para búsqueda parcial
            queryParams.push(`%${search}%`);
            index++;
        }

        // Agregar condiciones WHERE si existen
        if (whereConditions.length > 0) {
            // Concatenar las condiciones WHERE usando AND si hay varias
            query += ` WHERE ` + whereConditions.join(' AND ');
        }

        // Añadir el límite de resultados
        query += ` LIMIT $${index}`;
        // Agregar el límite de resultados como parámetro
        queryParams.push(limit);

        try {
            // Ejecutar la consulta con los parámetros preparados
            const result = await pool.query(query, queryParams);
            // Retornar las filas de resultados obtenidas
            return result.rows;
        } catch (error) {
            // Manejar errores de consulta y lanzar un error personalizado
            throw new Error('Error al ejecutar la consulta: ' + error.message);
        }
    }























    async findAll() {
        const result = await pool.query('SELECT * FROM departments');
        return result.rows;
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
