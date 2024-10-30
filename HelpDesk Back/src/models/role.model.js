import pool from '../config/db.js';

class Role {
    //? Funcionalidad para busqueda por ID, retorna un registro
    async findById(role_id) {
        const result = await pool.query('SELECT * FROM roles WHERE id = $1', [role_id]);
        return result.rows[0];
    }
    async findAll() {
        const result = await pool.query('SELECT * FROM roles');
        return result.rows;
    }
}

export default new Role();
