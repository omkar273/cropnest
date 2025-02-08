import { Router } from 'express';
import { upload } from '../../middlewares/index.js';
import { uploadFile } from '../../utils/upload_file';
import { uploadFileToCloudinary } from '../../core/cloudianry/config.js';

const fileRouter = Router();

fileRouter.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files as Express.Multer.File[];
        const urls = await Promise.all(
            files.map(async (file) => {
                const res = await uploadFileToCloudinary({
                    filePath: file.path,
                    folder: 'files',
                });
                return res;
            })
        );
        res.status(200).json({ urls });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload files' });
    }
});

export { fileRouter };
