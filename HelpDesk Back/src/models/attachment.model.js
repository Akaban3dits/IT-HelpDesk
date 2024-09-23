import pool from '../config/db.js';

class Attachment {
    async findAll() {
        const result = await pool.query('SELECT * FROM attachments');
        return result.rows;
    }

    async findById(attachment_id) {
        const result = await pool.query('SELECT * FROM attachments WHERE attachment_id = $1', [attachment_id]);
        return result.rows[0];
    }

    async create({ file_path, uploaded_at, ticket_id }) {
        const result = await pool.query(
            `INSERT INTO attachments (file_path, uploaded_at, ticket_id)
             VALUES ($1, $2, $3) RETURNING *`,
            [file_path, uploaded_at, ticket_id]
        );
        return result.rows[0];
    }

    async update(attachment_id, { file_path, uploaded_at, ticket_id }) {
        const result = await pool.query(
            `UPDATE attachments SET 
                file_path = $1,
                uploaded_at = $2,
                ticket_id = $3
            WHERE 
                attachment_id = $4 RETURNING *`,
            [file_path, uploaded_at, ticket_id, attachment_id]
        );
        return result.rows[0];
    }

    async delete(attachment_id) {
        const result = await pool.query('DELETE FROM attachments WHERE attachment_id = $1 RETURNING *', [attachment_id]);
        return result.rows[0];
    }
}

export default new Attachment();
