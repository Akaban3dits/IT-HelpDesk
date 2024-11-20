import pool from '../config/db.js';

class Device {
    //Funcionalidad comprobada
    async getDevices(search = '') {
        try {
            // Definir la consulta base para seleccionar el ID y el nombre del dispositivo
            let query = `
                SELECT id, device_name
                FROM devices
            `;
            // Array para almacenar parámetros de consulta
            let queryParams = [];
            // Agregar condición de búsqueda si se proporciona un término
            if (search) {
                // Añadir cláusula WHERE para búsqueda parcial en el nombre del dispositivo
                query += ` WHERE device_name ILIKE $1`;
                // Agregar el valor de búsqueda con comodines (%) para permitir coincidencias parciales
                queryParams.push(`%${search}%`);
            }

            // Limitar los resultados a un máximo de 10 dispositivos
            query += ` LIMIT 10`;

            // Ejecutar la consulta con los parámetros preparados
            const result = await pool.query(query, queryParams);

            // Retornar las filas de resultados obtenidas
            return result.rows;
        } catch (error) {
            throw new Error('Error al ejecutar la consulta en departamentos: ' + error.message);
        }
    }

}

export default new Device();
