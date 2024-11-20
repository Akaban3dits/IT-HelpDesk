import attachmentModel from '../models/attachment.model.js';
import priorityModel from '../models/priority.model.js';
import statusModel from '../models/status.model.js';
import TicketModel from '../models/ticket.model.js';
import fs from 'fs/promises';

class TicketService {

    //* En uso
    async createTicket(ticketData, attachments = []) {
        let ticket = null;
        const uploadedFiles = [];

        try {
            // Crear el ticket y obtener su ID
            ticket = await TicketModel.create(ticketData);

            // Si hay archivos adjuntos, procesarlos
            if (attachments.length > 0) {
                // Actualizar los attachments con el ID del ticket recién creado
                const enrichedAttachments = attachments.map(attachment => ({
                    ...attachment,
                    ticket_id: ticket.id
                }));

                // Insertar los attachments en la base de datos
                await attachmentModel.createAttachments(enrichedAttachments);

                // Registrar los archivos subidos para posible rollback
                uploadedFiles.push(...enrichedAttachments);
            }

            // Obtener el ticket completo con sus attachments
            const completeTicket = await this.getTicketById(ticket.id);
            return completeTicket;

        } catch (error) {
            console.error('Error en la creación del ticket:', error);

            // Realizar rollback en caso de error
            await this.handleRollback(ticket?.id, uploadedFiles);

            // Lanzar el error para que el controlador lo maneje
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        // Obtener los attachments asociados al ticket
        const attachments = await attachmentModel.getAttachmentsByTicketId(ticketId);
        return {
            ...ticket,
            attachments
        };
    }

    async handleRollback(ticketId, uploadedFiles) {
        try {
            // 1. Eliminar archivos físicos
            if (uploadedFiles.length > 0) {
                await this.deleteUploadedFiles(uploadedFiles);
            }

            // 2. Eliminar registros de attachments si el ticket existe
            if (ticketId) {
                await attachmentModel.deleteAttachmentsByTicketId(ticketId);
            }

            // 3. Eliminar el ticket si existe
            if (ticketId) {
                await TicketModel.delete(ticketId);
            }
        } catch (rollbackError) {
            console.error('Error durante el rollback:', rollbackError);
            // No relanzamos el error del rollback para no ocultar el error original
        }
    }

    async deleteUploadedFiles(attachments) {
        const deletePromises = attachments.map(async (attachment) => {
            try {
                await fs.unlink(attachment.file_path);
                console.log(`Archivo eliminado con éxito: ${attachment.file_path}`);
            } catch (err) {
                console.warn(`No se pudo eliminar el archivo: ${attachment.file_path}`, err);
                // No lanzamos el error para continuar con los demás archivos
            }
        });

        await Promise.allSettled(deletePromises);
    }

    // Servicio
    async gettickets(
        page = 1,
        limit = 10,
        search = '',
        filterColumn = '',
        filterValue = '',
        sortBy = 'id',
        sortDirection = 'asc',
        status = '',
        priority = '',
        dateRange = ''  // Nuevo parámetro de rango de fechas
    ) {
        try {
            const result = await TicketModel.gettickets(
                page,
                limit,
                search,
                filterColumn,
                filterValue,
                sortBy,
                sortDirection,
                status,
                priority,
                dateRange  // Pasar el rango de fecha al modelo
            );
            return result;
        } catch (error) {
            throw error;
        }
    }



    async getTicketByFriendlyCode(friendlyCode) {
        const ticket = await TicketModel.findByFriendlyCode(friendlyCode);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        // Obtener los detalles completos de los attachments asociados al ticket
        const attachments = await attachmentModel.getAttachmentsByTicketId(ticket.id);
        return {
            ...ticket,
            attachments // Añade los archivos adjuntos completos al ticket
        };
    }

    async getMonthlyTicketCounts() {
        try {
            // Llamada al modelo para obtener los totales de tickets por mes
            const result = await TicketModel.getMonthlyTicketCounts();
            return result;
        } catch (error) {
            // Lanza el error para que el controlador lo capture
            throw error;
        }
    }

    async getDailyTicketStatusCounts() {
        try {
            const result = await TicketModel.getDailyTicketStatusCounts();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateTicketByFriendlyCode(friendlyCode, updateData) {
        try {
            // Obtener el ticket actual para verificar el estado actual
            const currentTicket = await TicketModel.getTicketByFriendlyCode(friendlyCode);
            if (!currentTicket) {
                throw new Error('El ticket no existe');
            }
    
            // Convertir `status_name` a `status_id` solo si se proporciona `status_name`
            if (updateData.status_name) {
                updateData.status_id = await statusModel.getStatusIdByName(updateData.status_name);
                if (!updateData.status_id) {
                    throw new Error(`El estado "${updateData.status_name}" no existe en la base de datos`);
                }
                delete updateData.status_name; // Remover `status_name` después de obtener el ID
            } else {
                updateData.status_id = currentTicket.status_id; // Mantener el estado actual si no se envía
            }
    
            // Convertir `priority_name` a `priority_id` solo si se proporciona `priority_name`
            if (updateData.priority_name) {
                updateData.priority_id = await priorityModel.getPriorityIdByName(updateData.priority_name);
                if (!updateData.priority_id) {
                    throw new Error(`La prioridad "${updateData.priority_name}" no existe en la base de datos`);
                }
                delete updateData.priority_name; // Remover `priority_name` después de obtener el ID
            } else {
                updateData.priority_id = currentTicket.priority_id; // Mantener la prioridad actual si no se envía
            }
    
            // Si `assigned_user_id` no se proporciona, mantener el valor actual
            updateData.assigned_user_id = updateData.assigned_user_id || currentTicket.assigned_user_id;
    
            // Obtener el ID correspondiente al estado "Cerrado"
            const closedStatusId = await statusModel.getStatusIdByName('Cerrado');
            if (!closedStatusId) {
                throw new Error('No se pudo encontrar el estado "Cerrado" en la base de datos');
            }
    
            // Actualizar la fecha de cierre si el estado cambia a "Cerrado"
            let closedAt = currentTicket.closed_at; // Mantener el valor actual
            let statusUpdated = false; // Bandera para verificar si el estado fue actualizado
    
            if (updateData.status_id !== currentTicket.status_id) {
                statusUpdated = true; // Indica que el estado ha cambiado
                if (updateData.status_id === closedStatusId) {
                    closedAt = new Date(); // Asigna la fecha de cierre actual
                }
            }
    
            // Obtener el nombre del estado actual (antes de la actualización)
            const currentStatusName = await statusModel.getStatusNameById(currentTicket.status_id);
    
            // Actualizar el ticket en el modelo
            const updatedTicket = await TicketModel.updateByFriendlyCode(friendlyCode, {
                ...updateData,
                closed_at: closedAt,
                updated_at: new Date() // Actualiza `updated_at` con la fecha actual
            });
    
            // Llamar a status.create si el estado ha cambiado
            if (statusUpdated) {
                const newStatusName = await statusModel.getStatusNameById(updateData.status_id);
                await statusModel.create(
                    updatedTicket.id,
                    currentStatusName, // Estado anterior en formato de nombre
                    newStatusName, // Nombre del nuevo estado
                    updateData.assigned_user_id // Usuario que realizó el cambio
                );
            }
    
            return updatedTicket; // Retornar el ticket actualizado
        } catch (error) {
            throw error; // Lanza el error para que el controlador lo capture
        }
    }
    
}

export default new TicketService();
