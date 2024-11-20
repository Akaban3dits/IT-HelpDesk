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
}

export default new Department();
