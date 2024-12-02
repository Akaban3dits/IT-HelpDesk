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
            throw new Error('Error al ejecutar la consulta: ' + error.message);
        }
    }

    async getDeviceById(id) {
        try {
            const query = `
                SELECT d.device_name, dt.type_code
                FROM devices d
                JOIN device_types dt ON d.device_type_id = dt.id
                WHERE d.id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener el dispositivo:', error.message);
            throw new Error('Error al obtener el dispositivo');
        }
    }

    async fetchDevicesList(page = 1, limit = 10, search = '') {
        try {
            const offset = (page - 1) * limit;
    
            // Base de la consulta
            let query = `
                SELECT d.id, d.device_name, dt.type_name AS device_type
                FROM devices d
                LEFT JOIN device_types dt ON d.device_type_id = dt.id
            `;
            const queryParams = [];
    
            // Agregar condición de búsqueda si `search` no está vacío
            if (search.trim()) {
                query += ` WHERE d.device_name ILIKE $1`;
                queryParams.push(`%${search.trim()}%`);
            }
    
            query += ` ORDER BY d.device_name ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(limit, offset);
    
            console.log('Query:', query); // Log de la consulta
            console.log('Query Params:', queryParams); // Log de los parámetros
    
            const result = await pool.query(query, queryParams);
    
            // Consulta para el conteo total
            let countQuery = `SELECT COUNT(*) FROM devices`;
            const countParams = [];
    
            if (search.trim()) {
                countQuery += ` WHERE device_name ILIKE $1`;
                countParams.push(`%${search.trim()}%`);
            }
    
            const countResult = await pool.query(countQuery, countParams);
    
            console.log('Count Query:', countQuery); // Log de la consulta de conteo
            console.log('Count Params:', countParams); // Log de los parámetros del conteo
    
            return {
                devices: result.rows,
                total_pages: Math.ceil(countResult.rows[0].count / limit),
                current_page: page,
            };
        } catch (error) {
            console.error('Error en DeviceModel.fetchDevicesList:', error.message);
            throw error;
        }
    }
    
    
    

    // Crear un dispositivo
    async createDevice(device_name, device_type_id) {
        try {
            // Verificar si el nombre ya existe
            const checkQuery = `
                SELECT * 
                FROM devices 
                WHERE device_name = $1
            `;
            const checkResult = await pool.query(checkQuery, [device_name]);

            if (checkResult.rows.length > 0) {
                throw new Error('El nombre del dispositivo ya existe');
            }

            // Insertar el nuevo dispositivo
            const query = `
                INSERT INTO devices (device_name, device_type_id)
                VALUES ($1, $2)
                RETURNING *
            `;
            const result = await pool.query(query, [device_name, device_type_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en DeviceModel.createDevice:', error.message);
            throw error;
        }
    }


    // Actualizar un dispositivo
    async updateDevice(id, device_name, device_type_id) {
        try {
            // Verificar si el nombre ya existe en otro dispositivo
            const checkQuery = `
                SELECT * 
                FROM devices 
                WHERE device_name = $1 AND id != $2
            `;
            const checkResult = await pool.query(checkQuery, [device_name, id]);
    
            if (checkResult.rows.length > 0) {
                throw new Error('El nombre del dispositivo ya existe');
            }
    
            // Actualizar el dispositivo
            const query = `
                UPDATE devices
                SET device_name = $1, device_type_id = $2
                WHERE id = $3
                RETURNING *
            `;
            const result = await pool.query(query, [device_name, device_type_id, id]);
            if (result.rows.length === 0) throw new Error('Dispositivo no encontrado');
            return result.rows[0];
        } catch (error) {
            console.error('Error en DeviceModel.updateDevice:', error.message);
            throw error;
        }
    }

    // Eliminar un dispositivo
    async deleteDevice(id) {
        try {
            const query = `
                DELETE FROM devices
                WHERE id = $1
            `;
            const result = await pool.query(query, [id]);
            if (result.rowCount === 0) throw new Error('Dispositivo no encontrado');
        } catch (error) {
            console.error('Error en DeviceModel.deleteDevice:', error.message);
            throw error;
        }
    }

}

export default new Device();
