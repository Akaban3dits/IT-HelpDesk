import { Router } from 'express';
import DepartmentController from '../controllers/department.controller.js';

const router = Router();

//*Rutas funcionales
router.get('/departments/search', DepartmentController.searchDepartments);

//TODO Crear Editar Eliminar

export default router;
