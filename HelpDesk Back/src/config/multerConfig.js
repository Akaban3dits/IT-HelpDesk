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

// Filtros de archivos opcionales (por ejemplo, permitir solo imágenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

// Límite de tamaño del archivo (opcional)
const limits = {
    fileSize: 1024 * 1024 * 5 // 5 MB
};

// Inicializar multer con la configuración
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

export default upload;
