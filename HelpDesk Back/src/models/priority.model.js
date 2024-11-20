import pool from '../config/db.js';

class Priority {

    //*Funcion en uso
    async findAll() {
        try {
            console.log("result.rows")
            const result = await pool.query('SELECT * FROM priority');
            return result.rows;
        } catch (error) {
            throw new Error('Error al ejecutar la consulta para las prioridades')
        }
    }

    async getPriorityIdByName(priorityName) {
        try {
            const result = await pool.query(
                `SELECT id FROM priority WHERE priority_name = $1 LIMIT 1`,
                [priorityName]
            );
            return result.rows[0]?.id || null;
        } catch (error) {
            throw error; // Capturar y lanzar cualquier error en la consulta
        }
    }

}

export default new Priority();
