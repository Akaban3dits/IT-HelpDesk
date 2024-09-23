import AttachmentModel from '../models/attachment.model.js';

class AttachmentService {
    async createAttachment(attachmentData) {
        return await AttachmentModel.create(attachmentData);
    }

    async getAllAttachments() {
        return await AttachmentModel.findAll();
    }

    async getAttachmentById(attachmentId) {
        return await AttachmentModel.findById(attachmentId);
    }

    async updateAttachment(attachmentId, attachmentData) {
        return await AttachmentModel.update(attachmentId, attachmentData);
    }

    async deleteAttachment(attachmentId) {
        return await AttachmentModel.delete(attachmentId);
    }
}

export default new AttachmentService();
