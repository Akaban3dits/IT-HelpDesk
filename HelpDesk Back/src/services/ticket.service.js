import attachmentModel from '../models/attachment.model.js';
import priorityModel from '../models/priority.model.js';
import statusModel from '../models/status.model.js';
import TicketModel from '../models/ticket.model.js';
import fs from 'fs/promises';
import notificationService from './notification.service.js';
import userService from './user.service.js';

class TicketService {

    //* En uso
    async createTicket(ticketData, attachments = []) {
        let ticket = null;
        const uploadedFiles = [];

        try {
            // Crear el ticket y obtener su ID
            ticket = await TicketModel.create(ticketData);

            // Procesar archivos adjuntos, si existen
            if (attachments.length > 0) {
                const enrichedAttachments = attachments.map((attachment) => ({
                    ...attachment,
                    ticket_id: ticket.friendly_code,
                }));

                try {
                    // Intentar crear los adjuntos en la base de datos
                    await attachmentModel.createAttachments(enrichedAttachments);
                    uploadedFiles.push(...enrichedAttachments);  // Guardar archivos procesados correctamente
                } catch (attachmentError) {
                    console.error('Error al procesar los attachments:', attachmentError);
                    throw new Error('No se pudieron guardar los adjuntos. Se procederá con el rollback.');
                }
            }

            // Crear notificación para la creación del ticket
            await notificationService.createNotification({
                ticket_id: ticket.friendly_code,
                type: 'Nuevo Ticket',
                message: `Se ha creado un nuevo ticket: ${ticket.friendly_code}`,
                recipients: await userService.getAdminAndSuperadminIds(),
            });

            // Crear notificación si hay un usuario asignado
            if (ticketData.assigned_user_id) {
                const { assigned_user_id, created_by } = ticketData;

                if (assigned_user_id !== created_by) {
                    await notificationService.createNotification({
                        ticket_id: ticket.friendly_code,
                        type: 'Asignación',
                        message: `Has sido asignado al ticket: ${ticket.friendly_code}`,
                        recipients: [assigned_user_id],
                    });
                }
            }

            // Obtener el ticket completo con sus adjuntos
            const completeTicket = await this.getTicketById(ticket.friendly_code);
            return completeTicket;

        } catch (error) {
            console.error('Error en la creación del ticket:', error);

            // Realizar rollback en caso de error
            await this.handleRollback(ticket?.friendly_code, uploadedFiles);

            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async handleRollback(ticketId, uploadedFiles) {
        try {
            // 1. Eliminar archivos físicos
            if (uploadedFiles.length > 0) {
                await this.deleteUploadedFiles(uploadedFiles);
            }

            // 2. Eliminar registros de adjuntos si el ticket existe
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
                await fs.promises.unlink(attachment.file_path);  // Eliminar archivo físico
            } catch (err) {
                console.warn(`No se pudo eliminar el archivo: ${attachment.file_path}`, err);
                // No lanzamos el error para continuar con los demás archivos
            }
        });

        // Esperar que todas las promesas de eliminación se resuelvan
        await Promise.allSettled(deletePromises);
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await TicketModel.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            // Obtener los attachments asociados al ticket
            const attachments = await attachmentModel.getAttachmentsByTicketId(ticketId);
            return {
                ...ticket,
                attachments,
            };
        } catch (error) {
            console.error('Error al obtener el ticket:', error);
            throw error;
        }
    }

    // Servicio
    async gettickets(
        page = 1,
        limit = 10,
        search = '',
        filterColumn = '',
        filterValue = '',
        sortBy = 'created_at',
        sortDirection = 'desc',
        status = '',
        priority = '',
        dateOption = '', // Nuevo parámetro
        isAssigned = null, // Booleano para assigned_user_id o created_by
        createdBy = '' // Valor por defecto como string vacío
    ) {
        try {
            const tickets = await TicketModel.gettickets(
                page,
                limit,
                search,
                filterColumn,
                filterValue,
                sortBy,
                sortDirection,
                status,
                priority,
                dateOption,
                isAssigned,
                createdBy
            );
            return tickets;
        } catch (error) {
            throw new Error('Error al obtener los tickets.');
        }
    }




    async getTicketByFriendlyCode(friendlyCode) {
        const ticket = await TicketModel.findByFriendlyCode(friendlyCode);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        // Obtener los detalles completos de los attachments asociados al ticket
        const attachments = await attachmentModel.getAttachmentsByTicketId(ticket.friendly_code);
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
            // Obtener el ticket actual
            const currentTicket = await TicketModel.getTicketByFriendlyCode(friendlyCode);
            if (!currentTicket) {
                throw new Error('El ticket no existe');
            }

            // Preparar campos a actualizar
            const fieldsToUpdate = {
                title: updateData.title || currentTicket.title,
                description: updateData.description || currentTicket.description,
                status_id: currentTicket.status_id,
                priority_id: currentTicket.priority_id,
                assigned_user_id: updateData.assigned_user_id || currentTicket.assigned_user_id,
                department_id: updateData.department_id || currentTicket.department_id,
                closed_at: currentTicket.closed_at,
                updated_at: new Date() // Actualiza `updated_at` con la fecha actual
            };

            // Convertir `status_name` a `status_id` si es necesario
            if (updateData.status_name) {
                fieldsToUpdate.status_id = await statusModel.getStatusIdByName(updateData.status_name);
                if (!fieldsToUpdate.status_id) {
                    throw new Error(`El estado "${updateData.status_name}" no existe`);
                }
            }

            // Convertir `priority_name` a `priority_id` si es necesario
            if (updateData.priority_name) {
                fieldsToUpdate.priority_id = await priorityModel.getPriorityIdByName(updateData.priority_name);
                if (!fieldsToUpdate.priority_id) {
                    throw new Error(`La prioridad "${updateData.priority_name}" no existe`);
                }
            }

            // Actualizar fecha de cierre si el estado cambia a "Cerrado"
            const closedStatusId = await statusModel.getStatusIdByName('Cerrado');
            if (fieldsToUpdate.status_id !== currentTicket.status_id) {
                if (fieldsToUpdate.status_id === closedStatusId) {
                    fieldsToUpdate.closed_at = new Date();
                } else {
                    fieldsToUpdate.closed_at = null; // Limpiar la fecha de cierre si ya no está cerrado
                }
            }

            // Actualizar ticket en la base de datos
            const updatedTicket = await TicketModel.updateByFriendlyCode(friendlyCode, fieldsToUpdate);

            // Gestionar notificaciones
            const notifications = [];

            // Notificar cambio de estado al creador si no es quien actualiza
            if (fieldsToUpdate.status_id !== currentTicket.status_id) {
                if (currentTicket.created_by !== updateData.updated_by) {
                    notifications.push({
                        ticket_id: friendlyCode,
                        type: 'Actualización',
                        message: `El estado del ticket "${friendlyCode}" ha cambiado a "${await statusModel.getStatusNameById(fieldsToUpdate.status_id)}".`,
                        recipients: [currentTicket.created_by]
                    });
                }
            }

            // Notificar cambio de encargado
            if (fieldsToUpdate.assigned_user_id !== currentTicket.assigned_user_id) {
                // Al nuevo encargado
                if (fieldsToUpdate.assigned_user_id) {
                    notifications.push({
                        ticket_id: friendlyCode,
                        type: 'Asignación',
                        message: `Se te ha asignado el ticket "${friendlyCode}".`,
                        recipients: [fieldsToUpdate.assigned_user_id]
                    });
                }

                // Al encargado anterior
                if (currentTicket.assigned_user_id) {
                    notifications.push({
                        ticket_id: friendlyCode,
                        type: 'Asignación',
                        message: `Ya no estás asignado al ticket "${friendlyCode}".`,
                        recipients: [currentTicket.assigned_user_id]
                    });
                }
            }

            // Crear las notificaciones en el servicio de notificaciones
            for (const notification of notifications) {
                await notificationService.createNotification(notification);
            }

            if (fieldsToUpdate.status_id !== currentTicket.status_id) {
                await statusModel.create(
                    friendlyCode,
                    await statusModel.getStatusNameById(currentTicket.status_id), // Estado anterior
                    await statusModel.getStatusNameById(fieldsToUpdate.status_id), // Nuevo estado
                    updateData.updated_by || null // Usuario que realizó el cambio
                );
            }

            return updatedTicket; // Retornar el ticket actualizado
        } catch (error) {
            throw new Error('Error al actualizar el ticket: ' + error.message);
        }
    }
}

export default new TicketService();
