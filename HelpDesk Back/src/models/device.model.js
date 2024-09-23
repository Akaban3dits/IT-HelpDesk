import pool from '../config/db.js';

class Device {
    async findAll() {
        const result = await pool.query('SELECT * FROM devices');
        return result.rows;
    }

    async findById(device_id) {
        const result = await pool.query('SELECT * FROM devices WHERE device_id = $1', [device_id]);
        return result.rows[0];
    }

    async create({ device_name, serial_number, device_type_id }) {
        const result = await pool.query(
            'INSERT INTO devices (device_name, serial_number, device_type_id) VALUES ($1, $2, $3) RETURNING *',
            [device_name, serial_number, device_type_id]
        );
        return result.rows[0];
    }

    async update(device_id, { device_name, serial_number, device_type_id }) {
        const result = await pool.query(
            'UPDATE devices SET device_name = $1, serial_number = $2, device_type_id = $3 WHERE device_id = $4 RETURNING *',
            [device_name, serial_number, device_type_id, device_id]
        );
        return result.rows[0];
    }

    async delete(device_id) {
        const result = await pool.query('DELETE FROM devices WHERE device_id = $1 RETURNING *', [device_id]);
        return result.rows[0];
    }
}

export default new Device();
