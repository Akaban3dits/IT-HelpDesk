import pool from '../config/db.js';
import User from './user.model.js';
import Status from './status.model.js';
import Priority from './priority.model.js';
import Category from './category.model.js';
import Device from './device.model.js';
import Comment from './comment.model.js';
import Attachment from './attachment.model.js';

class Ticket {
    async findById(ticket_id) {
        const result = await pool.query('SELECT * FROM tickets WHERE ticket_id = $1', [ticket_id]);
        const ticket = result.rows[0];
        return ticket ? await this._mapTicket(ticket) : null;
    }

    async findAll({ page, limit }) {
        const offset = (page - 1) * limit;
        const result = await pool.query(
            `SELECT ticket_id, friendly_code, created_at, status_id, priority_id, assigned_user_id 
             FROM tickets ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return Promise.all(result.rows.map(ticket => this._mapSimpleTicket(ticket)));
    }
    async delete(ticketId) {
        await pool.query('DELETE FROM tickets WHERE id = $1', [ticketId]);
    }

    // Crear un nuevo ticket
    async create({ friendly_code, title, created_at, closed_at, description, status_id, priority_id, device_id, assigned_user_id, department_id, created_by, updated_by }) {
        const result = await pool.query(
            `INSERT INTO tickets (friendly_code, title, created_at, closed_at, description, status_id, priority_id, device_id, assigned_user_id, department_id, created_by, updated_by) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [friendly_code, title, created_at, closed_at, description, status_id, priority_id, device_id, assigned_user_id, department_id, created_by, updated_by]
        );
        return result.rows[0];
    }

    // Crear archivos adjuntos asociados al ticket
    async createAttachments(attachments) {
        const insertPromises = attachments.map(attachment => {
            return pool.query(
                `INSERT INTO attachments (file_path, uploaded_at, ticket_id, is_image) VALUES ($1, $2, $3, $4) RETURNING *`,
                [attachment.file_path, attachment.uploaded_at, attachment.ticket_id, attachment.is_image]
            );
        });
        return await Promise.all(insertPromises);
    }

    async update(ticket_id, { friendly_code, created_at, closed_at, description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id }) {
        const result = await pool.query(
            `UPDATE tickets SET 
                friendly_code = $1,
                created_at = $2,
                closed_at = $3,
                description = $4,
                status_id = $5,
                priority_id = $6,
                category_id = $7,
                device_id = $8,
                assigned_user_id = $9,
                department_id = $10
            WHERE 
                ticket_id = $11 RETURNING *`,
            [friendly_code, created_at, closed_at, description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id, ticket_id]
        );
        return result.rows[0];
    }
}

export default new Ticket();
