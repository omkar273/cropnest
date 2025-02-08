import multer from 'multer';

/**
 * Multer storage configuration for handling file uploads.
 *
 * This configuration specifies the destination folder and filename format for uploaded files.
 *
 * @constant
 * @type {multer.StorageEngine}
 *
 * @property {function} destination - Function to specify the destination folder for uploaded files.
 * @property {function} filename - Function to specify the filename format for uploaded files.
 *
 * @example
 * // Example usage:
 * const upload = multer({ storage: storage });
 *
 * @param {Object} req - The request object.
 * @param {Object} file - The file object containing file details.
 * @param {function} cb - Callback function to specify the destination folder or filename.
 *
 * @returns {void}
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // specify the destination folder
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 5, // 5 MB
};

export const upload = multer({ storage, limits });

export const largeFileUpload = multer({ storage });

export const largeImageFileUpload = multer({ storage, fileFilter });

export const imageUpload = multer({ storage, fileFilter, limits });
