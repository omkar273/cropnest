import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from '../../utils/index.js';

// Upload file to Cloudinary
interface Params {
    filePath: string;
    folder?: string;
}

export const uploadFileToCloudinary = async ({
    filePath,
    folder,
}: Params): Promise<string> => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new ApiError('File not found');
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder ?? 'images',
            use_filename: true,
            unique_filename: true,
            resource_type: 'auto',
        });

        // Delete the file after uploading to Cloudinary
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading file to Cloudinary', error);
        throw new ApiError('Failed to upload file to Cloudinary');
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
