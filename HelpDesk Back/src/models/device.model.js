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
            // Manejar errores de consulta, lanzando el error para su manejo en el nivel superior
            throw error;
        }
    }


    //! Funcionalidades sin uso


    async findAll() {
        const result = await pool.query('SELECT * FROM devices');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM devices WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create({ device_name, device_type_id }) {
        const result = await pool.query(
            'INSERT INTO devices (device_name, device_type_id) VALUES ($1, $2) RETURNING *',
            [device_name, device_type_id]
        );
        return result.rows[0];
    }

    async update(id, { device_name, device_type_id }) {
        const result = await pool.query(
            'UPDATE devices SET device_name = $1, device_type_id = $2 WHERE id = $3 RETURNING *',
            [device_name, device_type_id, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM devices WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }


}

export default new Device();
