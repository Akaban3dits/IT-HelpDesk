import { Router } from 'express';
import DepartmentController from '../controllers/department.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

//*Rutas funcionales
router.get('/departments/search', DepartmentController.searchDepartments);


export default router;
