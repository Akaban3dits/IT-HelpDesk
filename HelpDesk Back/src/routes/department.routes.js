import { Router } from 'express';
import DepartmentController from '../controllers/department.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

//*Rutas funcionales
router.get('/departments/search', DepartmentController.searchDepartments);

// Obtener departamentos con búsqueda y paginación
router.get('/departments/with-counts', authenticateToken, DepartmentController.getDepartmentsWithCounts);


// Crear un nuevo departamento
router.post('/departments', authenticateToken, DepartmentController.createDepartment);

// Editar un departamento existente
router.put('/departments/:id', authenticateToken, DepartmentController.updateDepartment);

// Eliminar un departamento
router.delete('/departments/:id', authenticateToken, DepartmentController.deleteDepartment);


export default router;
