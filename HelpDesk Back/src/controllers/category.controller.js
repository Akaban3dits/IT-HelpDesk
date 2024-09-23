import CategoryService from '../services/category.service.js';

class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await CategoryService.createCategory(req.body);
            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const deletedCategory = await CategoryService.deleteCategory(req.params.id);
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new CategoryController();
