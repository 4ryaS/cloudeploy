import { Router } from 'express';
import { config } from 'dotenv';
import { Storage } from '@google-cloud/storage';

const router = Router();

// Load environment variables
config();

const storage = new Storage();
const bucketName = process.env.BUCKET as string;

router.get('/*', async (req, res) => {
    const host = req.hostname;
    const id = host.split('.')[0];
    const filePath = req.path.startsWith('/') ? req.path.slice(1) : req.path;

    const file = storage.bucket(bucketName).file(`output/${id}/${filePath}`);

    try {
        const [exists] = await file.exists();
        if (!exists) {
            res.status(404).send('File not found');
            return;
        }

        const [contents] = await file.download();

        // Determine the content type based on the file extension
        const contentType =
            filePath.endsWith('.html')
                ? 'text/html'
                : filePath.endsWith('.css')
                ? 'text/css'
                : 'application/javascript';

        res.set('Content-Type', contentType);
        res.send(contents);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
