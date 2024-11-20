// upload.config.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

class UploadConfig {
    constructor() {
        this.allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        this.imageTypes = ['image/jpeg', 'image/png'];
        
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = this.getUploadPath();
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                cb(null, `${timestamp}${path.extname(file.originalname)}`);
            }
        });

        this.fileFilter = (req, file, cb) => {
            if (this.allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Tipo de archivo no soportado'), false);
            }
        };

        this.limits = {
            fileSize: 1024 * 1024 * 10 // 10 MB
        };
    }

    getSpanishMonth(monthIndex) {
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        return months[monthIndex];
    }

    getUploadPath() {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = this.getSpanishMonth(now.getMonth());
        const day = now.getDate().toString();
        
        const uploadPath = path.join('uploads', year, month, day);
        fs.mkdirSync(uploadPath, { recursive: true });
        return uploadPath;
    }

    isImage(mimetype) {
        return this.imageTypes.includes(mimetype);
    }

    initialize() {
        return multer({
            storage: this.storage,
            fileFilter: this.fileFilter,
            limits: this.limits
        });
    }
}

const uploadConfig = new UploadConfig();
export default uploadConfig;