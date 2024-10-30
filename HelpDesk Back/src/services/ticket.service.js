import TicketModel from '../models/ticket.model.js';

class TicketService {
    // Método para crear un ticket y guardar los archivos adjuntos
    async createTicket(ticketData, attachments) {
        let ticket = null;
        try {
            // Crear el ticket y obtener su ID
            ticket = await TicketModel.create(ticketData);

            // Actualizar los attachments con el ID del ticket recién creado
            attachments.forEach(attachment => {
                attachment.ticket_id = ticket.id;
            });

            // Insertar los attachments en la base de datos
            await TicketModel.createAttachments(attachments);

            // Si todo se completa correctamente, retornamos el ticket
            return ticket;
        } catch (error) {
            console.error('Error al crear el ticket o los archivos adjuntos:', error);

            // Rollback: Eliminar archivos subidos del servidor
            await this.deleteUploadedFiles(attachments);

            // Rollback: Eliminar el ticket creado si existe
            if (ticket) {
                await TicketModel.delete(ticket.id);
            }

            throw error; // Propagamos el error para manejarlo en el controlador
        }
    }

    // Método para eliminar archivos subidos en caso de error
    async deleteUploadedFiles(attachments) {
        for (const attachment of attachments) {
            try {
                await fs.unlink(attachment.file_path); // Eliminar el archivo del servidor
            } catch (err) {
                console.warn('No se pudo eliminar el archivo:', attachment.file_path, err);
            }
        }
    }
    // Método para obtener todos los tickets
    async getAllTickets() {
        return await TicketModel.findAll();
    }

    // Método para obtener un ticket por su ID
    async getTicketById(ticketId) {
        return await TicketModel.findById(ticketId);
    }

    // Método para actualizar un ticket
    async updateTicket(ticketId, ticketData) {
        return await TicketModel.update(ticketId, ticketData);
    }

    // Método para eliminar un ticket y sus archivos adjuntos
    async deleteTicket(ticketId) {
        // Eliminar archivos adjuntos asociados
        await TicketModel.deleteAttachmentsByTicketId(ticketId);

        // Eliminar el ticket
        return await TicketModel.delete(ticketId);
    }
}

export default new TicketService();
