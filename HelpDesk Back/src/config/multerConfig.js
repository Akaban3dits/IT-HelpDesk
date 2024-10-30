import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configurar la ruta donde se almacenarán los archivos subidos
const uploadDir = 'uploads/';

// Verificar si el directorio existe, si no, crearlo
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Carpeta donde se guardan los archivos
    },
    filename: function (req, file, cb) {
        // Definir un nombre de archivo único, por ejemplo, añadiendo la fecha actual
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Filtros de archivos para aceptar jpg, png, docx, pdf, xlsx
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado'), false);
    }
};

// Límite de tamaño del archivo (opcional)
const limits = {
    fileSize: 1024 * 1024 * 10 // 10 MB
};

// Inicializar multer con la configuración
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

export default upload;