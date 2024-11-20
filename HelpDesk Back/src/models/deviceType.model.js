import pool from '../config/db.js';

class DeviceType {
    async getdeviceType(search = ''){
        try {
            let query = 'Select id, type_name from device_types';
            let queryParams = [];
            if(search){
                query += 'Where device_name ILIKE $1';
                queryParams.push(`%${search}%`);
            }
            query += 'LIMIT 5';
            const result = await pool.query( query, queryParams);
            return result.rows;

        } catch (error) {
            throw new Error('Error al ejecutar la consulta en tipos: '+ error.message);
        }
    }
}

export default new DeviceType();
