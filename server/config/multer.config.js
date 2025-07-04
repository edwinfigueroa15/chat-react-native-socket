import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = req.uploadPath || 'uploads';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath + '/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtro para permitir imágenes
const fileFilter = (req, file, cb) => {
    // const allowedTypes = ['image/', 'application/pdf', 'video/'];
    const allowedTypes = ['image/'];
    const isValidType = allowedTypes.some(type => file.mimetype.startsWith(type));
    
    if (isValidType) cb(null, true);
    else cb(new Error('Solo se permiten archivos de imagen'));
};

// Configuración final de Multer
const multerConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

export default multerConfig;