// ticketController.js
import TicketService from '../services/ticket.service.js';
import UserService from '../services/user.service.js';
import uploadConfig from '../config/multerConfig.js';
import deviceService from '../services/device.service.js';

class TicketController {
    async createTicket(req, res, next) {
        try {
            // Obtiene el ID del usuario autenticado desde el token
            const createdBy = req.user.id; 
            const createdByName = req.user.username; 
    
            // Procesa archivos subidos
            let attachments = [];
            if (req.files && req.files.length > 0) {
                attachments = req.files.map(file => ({
                    file_path: file.path,
                    original_filename: file.originalname,
                    ticket_id: null,
                    uploaded_at: new Date(),
                    is_image: uploadConfig.isImage(file.mimetype)
                }));
            }
    
            // Verificar si el usuario asignado existe
            const { assigned_user_id, device_id } = req.body;
    
            if (assigned_user_id) {
                const assignedUser = await UserService.getUserById(assigned_user_id);
                if (!assignedUser) {
                    console.error('El usuario asignado no existe.');
                    return res.status(400).json({ error: 'El usuario asignado no existe.' });
                }
            }
            const device = await deviceService.getById(device_id);
            if (!device) {
                console.error('El dispositivo especificado no existe.');
                return res.status(400).json({ error: 'El dispositivo especificado no existe.' });
            }
            const typeCode = device.type_code;
            const friendlyCode = this.generateFriendlyCode(typeCode);
    
            // Agrega los datos adicionales necesarios
            const ticketData = {
                ...req.body,
                created_by: createdBy,
                created_by_name: createdByName,
                updated_by: createdBy,
                friendly_code: friendlyCode,
                created_at: new Date(),
                closed_at: null,
                priority_id: req.body.priority_id || null, // Convertir vacío a null
                assigned_user_id: req.body.assigned_user_id || null // Convertir vacío a null
            };
            const ticket = await TicketService.createTicket(ticketData, attachments);
    
            return res.status(201).json(ticket);
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
    
    
    generateFriendlyCode(typeCode) {
        const timestamp = Date.now(); // Timestamp actual en milisegundos
        const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase(); // Código aleatorio alfanumérico
        return `TCKT-${typeCode}${timestamp}-${randomPart}`;
    }
    

    // Controlador
    async gettickets(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                filterColumn = '',
                filterValue = '',
                sortBy = 'id',
                sortDirection = 'asc',
                status = '',
                priority = '',
                dateOption = '',
                isAssigned = null // Valor recibido de la solicitud
            } = req.query;
    
            const createdBy = req.user.id; // ID del usuario autenticado
    
    
            // Asegurarse de que isAssigned sea booleano o null
            let parsedIsAssigned;
            if (isAssigned === 'true') {
                parsedIsAssigned = true;
            } else if (isAssigned === 'false') {
                parsedIsAssigned = false;
            } else {
                parsedIsAssigned = null;
            }
            // Llamada al servicio con el valor procesado
            const ticketData = await TicketService.gettickets(
                parseInt(page),
                parseInt(limit),
                search,
                filterColumn,
                filterValue,
                sortBy,
                sortDirection,
                status,
                priority,
                dateOption,
                parsedIsAssigned, // Pasar booleano o null
                createdBy
            );
    
            return res.status(200).json(ticketData);
        } catch (error) {
            // Log para errores capturados
            console.error('Error en gettickets:', error);
            next(error);
        }
    }
    
    
    
    
    async getTicketByFriendlyCode(req, res, next) {
        try {
            const { friendlyCode } = req.params;
            const ticket = await TicketService.getTicketByFriendlyCode(friendlyCode);
            return res.status(200).json(ticket);
        } catch (error) {
            next(error);
        }
    }

    async getMonthlyTicketCounts(req, res, next) {
        try {
            const monthlyCounts = await TicketService.getMonthlyTicketCounts();
            res.status(200).json(monthlyCounts);
        } catch (error) {
            next(error);
        }
    }

    async getDailyTicketStatusCounts(req, res, next) {
        try {
            const dailyCounts = await TicketService.getDailyTicketStatusCounts();
            res.status(200).json(dailyCounts);
        } catch (error) {
            next(error);
        }
    }

    async updateTicket(req, res, next) {
        try {
            const { friendlyCode } = req.params; // Obtener el código amigable del ticket desde los parámetros de la URL
            const { status_name, priority_name, assigned_user_id } = req.body; // Obtener los datos de actualización del cuerpo de la solicitud
            const updatedBy = req.user.id; // ID del usuario que hace la actualización

            // Llama al servicio para actualizar el ticket usando nombres
            const updatedTicket = await TicketService.updateTicketByFriendlyCode(friendlyCode, {
                status_name,
                priority_name,
                assigned_user_id,
                updated_by: updatedBy // Incluye el ID del usuario que está actualizando
            });

            return res.status(200).json(updatedTicket); // Retorna el ticket actualizado en formato JSON
        } catch (error) {
            console.error('Error al actualizar el ticket:', error); // Log de error para depuración
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
}

export default new TicketController();
