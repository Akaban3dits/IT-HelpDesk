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

    async create({ friendly_code, created_at, closed_at, description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id }) {
        const result = await pool.query(
            `INSERT INTO tickets (friendly_code, created_at, closed_at, description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [friendly_code, created_at, closed_at, description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id]
        );
        return result.rows[0];
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

    async delete(ticket_id) {
        const result = await pool.query('DELETE FROM tickets WHERE ticket_id = $1 RETURNING *', [ticket_id]);
        return result.rows[0];
    }

    async _mapTicket(ticket) {
        ticket.assigned_user = await User.findById(ticket.assigned_user_id);
        ticket.status = await Status.findById(ticket.status_id);
        ticket.priority = await Priority.findById(ticket.priority_id);
        ticket.category = await Category.findById(ticket.category_id);
        ticket.device = await Device.findById(ticket.device_id);
        ticket.comments = await Comment.findAllByTicket(ticket.ticket_id);
        ticket.attachments = await Attachment.findAllByTicket(ticket.ticket_id);
        return ticket;
    }

    async _mapSimpleTicket(ticket) {
        ticket.assigned_user = await User.findById(ticket.assigned_user_id);
        ticket.status = await Status.findById(ticket.status_id);
        ticket.priority = await Priority.findById(ticket.priority_id);
        return ticket;
    }
}

export default new Ticket();
