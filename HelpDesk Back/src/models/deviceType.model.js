import pool from '../config/db.js';

class DeviceType {

    async getDeviceTypes(page = 1, limit = 10, search = '') {
        try {
            console.log('getDeviceTypes called');
            console.log('Initial params:', { page, limit, search });
    
            // Validar y parsear parámetros
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;
    
            console.log('Parsed params:', { page, limit, offset });
    
            // Asegurarse de que search tenga un valor correcto
            const searchValue = search ? `%${search}%` : '%';
            console.log('Search Value:', searchValue); // Verifica el valor final de búsqueda
    
            // Consulta principal con ILIKE para búsqueda
            const query = `
                SELECT * 
                FROM device_types 
                WHERE type_name ILIKE $1 OR type_code ILIKE $1
                ORDER BY type_name ASC
                LIMIT $2 OFFSET $3
            `;
            const queryParams = [searchValue, limit, offset];
    
            console.log('Query:', query);
            console.log('Query Params:', queryParams);
    
            const result = await pool.query(query, queryParams);
            console.log('Query Result:', result.rows);
    
            // Consulta para contar el total de resultados
            const countQuery = `
                SELECT COUNT(*) 
                FROM device_types 
                WHERE type_name ILIKE $1 OR type_code ILIKE $1
            `;
            const countResult = await pool.query(countQuery, [searchValue]);
    
            console.log('Count Query:', countQuery);
            console.log('Count Result:', countResult.rows[0].count);
    
            return {
                device_types: result.rows,
                total_pages: Math.ceil(countResult.rows[0].count / limit),
                current_page: page,
            };
        } catch (error) {
            console.error('Error en getDeviceTypes:', error.message);
            throw error;
        }
    }
    

    async createDeviceType(typeName, typeCode) {
        try {
            // Verificar si ya existe un registro con el mismo typeName o typeCode
            const checkQuery = `
                SELECT * 
                FROM device_types 
                WHERE type_name = $1 OR type_code = $2
            `;
            const checkResult = await pool.query(checkQuery, [typeName, typeCode]);

            if (checkResult.rows.length > 0) {
                throw new Error('El tipo de dispositivo con ese nombre o código ya existe');
            }

            // Insertar el nuevo tipo de dispositivo
            const query = `
                INSERT INTO device_types (type_name, type_code) 
                VALUES ($1, $2) RETURNING *
            `;
            const result = await pool.query(query, [typeName, typeCode]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el tipo de dispositivo:', error.message);
            throw error;
        }
    }

    async updateDeviceType(id, typeName, typeCode) {
        try {
            // Verificar si ya existe un registro con el mismo typeName o typeCode (excluyendo el registro actual)
            const checkQuery = `
                SELECT * 
                FROM device_types 
                WHERE (type_name = $1 OR type_code = $2) AND id != $3
            `;
            const checkResult = await pool.query(checkQuery, [typeName, typeCode, id]);

            if (checkResult.rows.length > 0) {
                throw new Error('El tipo de dispositivo con ese nombre o código ya existe');
            }

            // Actualizar el tipo de dispositivo
            const query = `
                UPDATE device_types 
                SET type_name = $1, type_code = $2 
                WHERE id = $3 
                RETURNING *
            `;
            const result = await pool.query(query, [typeName, typeCode, id]);

            if (result.rows.length === 0) {
                throw new Error('Tipo de dispositivo no encontrado');
            }

            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el tipo de dispositivo:', error.message);
            throw error;
        }
    }


    async deleteDeviceType(id) {
        try {
            const query = `
                DELETE FROM device_types 
                WHERE id = $1
            `;
            const result = await pool.query(query, [id]);
            if (result.rowCount === 0) throw new Error('Tipo de dispositivo no encontrado');
        } catch (error) {
            console.error('Error al eliminar el tipo de dispositivo:', error.message);
            throw error;
        }
    }

    async getsearchDeviceTypes(search = '') {
        try {
            // Definir la consulta base
            let query = `
                SELECT id, type_name, type_code
                FROM device_types
            `;
    
            // Preparar los parámetros para la consulta
            const queryParams = [];
    
            // Agregar condición de búsqueda si el término de búsqueda no está vacío
            if (search) {
                query += ` WHERE type_name ILIKE $1 OR type_code ILIKE $1`;
                queryParams.push(`%${search}%`);
            }
    
            // Limitar los resultados
            query += ` LIMIT 3`;
    
            // Ejecutar la consulta
            const result = await pool.query(query, queryParams);
    
            // Retornar los resultados obtenidos
            return result.rows;
        } catch (error) {
            console.error('Error en DeviceTypeModel.getDeviceTypes:', error.message);
            throw new Error('Error al ejecutar la consulta: ' + error.message);
        }
    }
    
}

export default new DeviceType();
