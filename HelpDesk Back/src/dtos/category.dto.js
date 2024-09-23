/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryDto:
 *       type: object
 *       required:
 *         - category_name
 *       properties:
 *         category_name:
 *           type: string
 *           description: El nombre de la categoría
 *       example:
 *         category_name: "Software"
 */

class CreateCategoryDto {
    constructor({ category_name }) {
        this.category_name = category_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCategoryDto:
 *       type: object
 *       required:
 *         - category_name
 *       properties:
 *         category_name:
 *           type: string
 *           description: El nombre de la categoría
 *       example:
 *         category_name: "Software"
 */

class UpdateCategoryDto {
    constructor({ category_name }) {
        this.category_name = category_name;
    }
}

export { CreateCategoryDto, UpdateCategoryDto };
