import AttachmentService from '../services/attachment.service.js';

class AttachmentController {
    async createAttachments(req, res) {
        try {
            const files = req.files; // Array de archivos cargados
            const { ticket_id } = req.body; // ID del ticket asociado

            // Recorrer los archivos y guardar la información en la base de dato
            const attachments = await Promise.all(
                files.map(file =>
                    AttachmentService.createAttachment({
                        file_path: file.path,
                        uploaded_at: new Date(),
                        ticket_id: ticket_id
                    })
                )
            );

            return res.status(201).json({ message: 'Archivos subidos exitosamente', attachments });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllAttachments(req, res) {
        try {
            const attachments = await AttachmentService.getAllAttachments();
            return res.status(200).json(attachments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAttachmentById(req, res) {
        try {
            const attachment = await AttachmentService.getAttachmentById(req.params.id);
            if (!attachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
            return res.status(200).json(attachment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateAttachment(req, res) {
        try {
            const updatedAttachment = await AttachmentService.updateAttachment(req.params.id, req.body);
            if (!updatedAttachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
            return res.status(200).json(updatedAttachment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteAttachment(req, res) {
        try {
            const deletedAttachment = await AttachmentService.deleteAttachment(req.params.id);
            if (!deletedAttachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
            return res.status(200).json({ message: 'Attachment deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new AttachmentController();
