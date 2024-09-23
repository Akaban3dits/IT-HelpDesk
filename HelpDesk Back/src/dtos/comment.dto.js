/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCommentDto:
 *       type: object
 *       required:
 *         - comment_text
 *         - ticket_id
 *         - user_id
 *       properties:
 *         comment_text:
 *           type: string
 *           description: El texto del comentario
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *         user_id:
 *           type: integer
 *           description: El ID del usuario que hizo el comentario
 *         parent_comment_id:
 *           type: integer
 *           description: El ID del comentario padre (si es una respuesta)
 *       example:
 *         comment_text: "Este es un comentario de prueba"
 *         ticket_id: 1
 *         user_id: 2
 *         parent_comment_id: null
 */

class CreateCommentDto {
    constructor({ comment_text, ticket_id, user_id, parent_comment_id }) {
        this.comment_text = comment_text;
        this.ticket_id = ticket_id;
        this.user_id = user_id;
        this.parent_comment_id = parent_comment_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentDto:
 *       type: object
 *       required:
 *         - comment_text
 *         - ticket_id
 *         - user_id
 *       properties:
 *         comment_text:
 *           type: string
 *           description: El texto del comentario
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *         user_id:
 *           type: integer
 *           description: El ID del usuario que hizo el comentario
 *         parent_comment_id:
 *           type: integer
 *           description: El ID del comentario padre (si es una respuesta)
 *       example:
 *         comment_text: "Este es un comentario actualizado"
 *         ticket_id: 1
 *         user_id: 2
 *         parent_comment_id: null
 */

class UpdateCommentDto {
    constructor({ comment_text, ticket_id, user_id, parent_comment_id }) {
        this.comment_text = comment_text;
        this.ticket_id = ticket_id;
        this.user_id = user_id;
        this.parent_comment_id = parent_comment_id;
    }
}

export { CreateCommentDto, UpdateCommentDto };
