import path from 'path';
import TicketService from '../services/ticket.service.js';
import UserService from '../services/user.service.js';
import fs from 'fs/promises';


class TicketController {
    // Método para crear un nuevo ticket
    async createTicket(req, res) {
        try {
            // Directorio donde se guardarán los archivos
            const uploadDir = path.join('uploads');
            
            // Crear la carpeta si no existe
            await this.createUploadDir(uploadDir);

            // Obtiene el ID del usuario autenticado desde el token
            const createdBy = req.user.id;

            // Genera un código amigable para el ticket
            const friendlyCode = this.generateFriendlyCode();

            // Procesa archivos subidos
            let attachments = [];
            if (req.files && req.files.length > 0) {
                attachments = req.files.map(file => {
                    const filePath = path.join(uploadDir, file.filename);
                    console.log('Procesando archivo:', file.originalname, 'Ruta:', filePath);

                    // Determina si el archivo es una imagen basándose en su extensión
                    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file.originalname).toLowerCase());

                    return {
                        file_path: filePath,
                        ticket_id: null,
                        uploaded_at: new Date(),
                        is_image: isImage
                    };
                });
            } else {
                console.log('No se recibieron archivos adjuntos.');
            }

            // Verificar si el usuario asignado existe
            const { assigned_user_id } = req.body;
            if (assigned_user_id) {
                const assignedUser = await UserService.getUserById(assigned_user_id);
                if (!assignedUser) {
                    console.error('El usuario asignado no existe.');
                    return res.status(400).json({ error: 'El usuario asignado no existe.' });
                }
            }

            // Agrega los datos adicionales necesarios
            const ticketData = {
                ...req.body,
                created_by: createdBy,
                updated_by: createdBy,
                friendly_code: friendlyCode,
                created_at: new Date(),
                closed_at: null
            };

            // Crear el ticket con los datos y los adjuntos confirmados
            console.log('Creando ticket con los siguientes datos:', ticketData);
            const ticket = await TicketService.createTicket(ticketData, attachments);

            return res.status(201).json(ticket);
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            return res.status(500).json({ error: 'Error al crear el ticket', details: error.message });
        }
    }

    // Método para crear la carpeta si no existe
    async createUploadDir(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
            console.log('Carpeta creada o ya existente:', dirPath);
        } catch (err) {
            console.error('Error al crear la carpeta de subida:', err);
            throw err;
        }
    }
    // Método para obtener todos los tickets
    async getAllTickets(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const tickets = await TicketService.getAllTickets(page, limit);
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los tickets', details: error.message });
        }
    }

    // Método para obtener un ticket por ID
    async getTicketById(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await TicketService.getTicketWithDetails(ticketId);

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }

            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el ticket', details: error.message });
        }
    }

    // Método para actualizar un ticket
    async updateTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const updatedData = req.body;

            const updatedTicket = await TicketService.updateTicket(ticketId, updatedData);
            if (!updatedTicket) {
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }
            return res.status(200).json(updatedTicket);
        } catch (error) {
            return res.status(500).json({ error: 'Error al actualizar el ticket', details: error.message });
        }
    }

    // Método para eliminar un ticket
    async deleteTicket(req, res) {
        try {
            const ticketId = req.params.id;

            const deletedTicket = await TicketService.deleteTicket(ticketId);
            if (!deletedTicket) {
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }
            return res.status(200).json({ message: 'Ticket eliminado exitosamente' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar el ticket', details: error.message });
        }
    }

    // Función para generar un código amigable para el ticket
    generateFriendlyCode() {
        return `TCKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
}

export default new TicketController();
