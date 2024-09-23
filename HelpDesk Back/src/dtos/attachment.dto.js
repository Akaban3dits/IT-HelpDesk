/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAttachmentDto:
 *       type: object
 *       required:
 *         - file_path
 *         - ticket_id
 *       properties:
 *         file_path:
 *           type: string
 *           description: La ruta del archivo adjunto
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *       example:
 *         file_path: "/uploads/file.pdf"
 *         ticket_id: 1
 */

class CreateAttachmentDto {
    constructor({ file_path, ticket_id }) {
        this.file_path = file_path;
        this.ticket_id = ticket_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateAttachmentDto:
 *       type: object
 *       required:
 *         - file_path
 *         - ticket_id
 *       properties:
 *         file_path:
 *           type: string
 *           description: La ruta del archivo adjunto
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *       example:
 *         file_path: "/uploads/file_updated.pdf"
 *         ticket_id: 1
 */

class UpdateAttachmentDto {
    constructor({ file_path, ticket_id }) {
        this.file_path = file_path;
        this.ticket_id = ticket_id;
    }
}

export { CreateAttachmentDto, UpdateAttachmentDto };
