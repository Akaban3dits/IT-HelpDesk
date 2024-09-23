import CategoryModel from '../models/category.model.js';

class CategoryService {
    async createCategory(categoryData) {
        return await CategoryModel.create(categoryData);
    }

    async getAllCategories() {
        return await CategoryModel.findAll();
    }

    async getCategoryById(categoryId) {
        return await CategoryModel.findById(categoryId);
    }

    async updateCategory(categoryId, categoryData) {
        return await CategoryModel.update(categoryId, categoryData);
    }

    async deleteCategory(categoryId) {
        return await CategoryModel.delete(categoryId);
    }
}

export default new CategoryService();
