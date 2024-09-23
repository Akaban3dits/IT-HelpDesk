import pool from '../config/db.js';

class DeviceType {
    async findAll() {
        const result = await pool.query('SELECT * FROM devicetype');
        return result.rows;
    }

    async findById(device_type_id) {
        const result = await pool.query('SELECT * FROM devicetype WHERE device_type_id = $1', [device_type_id]);
        return result.rows[0];
    }

    async create(device_type_name) {
        const result = await pool.query('INSERT INTO devicetype (device_type_name) VALUES ($1) RETURNING *', [device_type_name]);
        return result.rows[0];
    }

    async update(device_type_id, device_type_name) {
        const result = await pool.query('UPDATE devicetype SET device_type_name = $1 WHERE device_type_id = $2 RETURNING *', [device_type_name, device_type_id]);
        return result.rows[0];
    }

    async delete(device_type_id) {
        const result = await pool.query('DELETE FROM devicetype WHERE device_type_id = $1 RETURNING *', [device_type_id]);
        return result.rows[0];
    }
}

export default new DeviceType();
