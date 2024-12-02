import pool from '../config/db.js';

class Department {
    //? Funcionalidades comprobadas

    async searchDepartments(search = '', limit = 6) {
        // Definir la consulta base y limitar la búsqueda a 6 resultados
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
            // Lanzar el error para que sea manejado por el controlador
            throw new Error('Error al ejecutar la consulta en departamentos: ' + error.message);
        }
    }

    async getDepartmentsWithCounts(page = 1, limit = 10, search = '') {
        try {
            // Validar y calcular offset para paginación
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT 
                    d.id AS department_id,
                    d.department_name,
                    COUNT(DISTINCT u.friendly_code) AS total_users,
                    COUNT(DISTINCT t.friendly_code) AS total_tickets
                FROM 
                    departments d
                LEFT JOIN 
                    users u ON u.department_id = d.id
                LEFT JOIN 
                    tickets t ON t.department_id = d.id
                WHERE 
                    d.department_name ILIKE $1
                GROUP BY 
                    d.id
                ORDER BY 
                    d.department_name ASC
                LIMIT $2 OFFSET $3
            `;

            const queryParams = [`%${search}%`, limit, offset];
            const result = await pool.query(query, queryParams);

            // Contar el total de departamentos (sin límite ni offset)
            const countQuery = `
                SELECT 
                    COUNT(*) 
                FROM 
                    departments d
                WHERE 
                    d.department_name ILIKE $1
            `;
            const countResult = await pool.query(countQuery, [`%${search}%`]);

            return {
                departments: result.rows,
                total_pages: Math.ceil(countResult.rows[0].count / limit),
                current_page: page,
            };
        } catch (error) {
            console.error('Error en getDepartmentsWithCounts:', error.message);
            throw error;
        }
    }



    // Crear un nuevo departamento
    async createDepartment(departmentName) {
        try {
            // Verificar si el nombre ya existe
            const exists = await this.departmentNameExists(departmentName);
            if (exists) {
                throw new Error('El nombre del departamento ya existe');
            }

            const query = `INSERT INTO departments (department_name) VALUES ($1) RETURNING *`;
            const result = await pool.query(query, [departmentName]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el departamento:', error.message);
            throw error;
        }
    }


    // Editar un departamento existente
    async updateDepartment(id, departmentName) {
        try {
            // Verificar si el nombre ya existe (excluyendo el actual)
            const queryCheck = `SELECT COUNT(*) FROM departments WHERE department_name = $1 AND id != $2`;
            const resultCheck = await pool.query(queryCheck, [departmentName, id]);
            if (parseInt(resultCheck.rows[0].count, 10) > 0) {
                throw new Error('El nombre del departamento ya existe');
            }

            const query = `UPDATE departments SET department_name = $1 WHERE id = $2 RETURNING *`;
            const result = await pool.query(query, [departmentName, id]);
            if (result.rows.length === 0) throw new Error('Departamento no encontrado');
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el departamento:', error.message);
            throw error;
        }
    }


    // Verificar si el nombre del departamento ya existe
    async departmentNameExists(departmentName) {
        try {
            const query = `SELECT COUNT(*) FROM departments WHERE department_name = $1`;
            const result = await pool.query(query, [departmentName]);
            return parseInt(result.rows[0].count, 10) > 0; // Devuelve true si el departamento ya existe
        } catch (error) {
            console.error('Error al verificar el nombre del departamento:', error.message);
            throw error;
        }
    }


    // Eliminar un departamento
    async deleteDepartment(id) {
        try {
            const query = `DELETE FROM departments WHERE id = $1`;
            const result = await pool.query(query, [id]);
            if (result.rowCount === 0) throw new Error('Departamento no encontrado');
        } catch (error) {
            console.error('Error al eliminar el departamento:', error.message);
            throw error;
        }
    }
}

export default new Department();
