import pool from '../config/db.js';

class Attachment {
    async createAttachments(attachments) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertPromises = attachments.map(attachment => {
                const { file_path, original_filename, ticket_id, is_image } = attachment;
                return client.query(
                    `INSERT INTO attachments (
                        file_path,
                        original_filename,
                        ticket_id,
                        is_image
                    ) VALUES ($1, $2, $3, $4) RETURNING *`,
                    [file_path, original_filename, ticket_id, is_image]
                );
            });

            const results = await Promise.all(insertPromises);
            await client.query('COMMIT');

            return results.map(result => result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getAttachmentsByTicketId(ticketId) {
        try {
            const result = await pool.query(
                'SELECT * FROM attachments WHERE ticket_id = $1 ORDER BY uploaded_at DESC',
                [ticketId]
            );
            return result.rows;
        } catch (error) {
            throw new Error('Error al ejecutar la consulta en adjuntos: ' + error.message);
        }
    }

    async deleteAttachmentsByTicketId(ticketId) {
        try {
            await pool.query(
                'DELETE FROM attachments WHERE ticket_id = $1',
                [ticketId]
            );
        } catch (error) {
            throw new Error('Error al ejecutar la consulta en adjuntos: ' + error.message);
        }
    }

    async getAttachmentsByTicketIdToPub(ticketId) {
        const result = await pool.query(
            `SELECT 
                id, 
                file_path, 
                original_filename, 
                uploaded_at, 
                is_image 
             FROM attachments 
             WHERE ticket_id = $1`,
            [ticketId]
        );

        return result.rows; 
    }
}

export default new Attachment();
