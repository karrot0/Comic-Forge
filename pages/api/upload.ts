import { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import fsPromises from 'fs/promises';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const body = await new Promise<any>((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      
      const { path: filePath } = body;
      
      // Ensure the path is within the public directory
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      // Check if file exists
      await fsPromises.access(fullPath);
      
      // Delete the file
      await fsPromises.unlink(fullPath);
      
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  } else if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    
    // Handle file upload
    if (contentType.includes('multipart/form-data')) {
      const form = formidable({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'),
        filename: (name, ext, part) => {
          return `${Date.now()}-${part.originalFilename}`;
        },
      });

      const [fields, files] = await form.parse(req);
      const file = files.file?.[0];

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const publicPath = `/uploads/${file.newFilename}`;
      return res.status(200).json({ path: publicPath });
    }
    
    // Handle base64 upload
    else {
      const body = await new Promise<any>((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });

      const { image, filename } = body;
      
      if (!image || !filename) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const base64Data = image.includes('base64,') 
        ? image.split('base64,')[1] 
        : image;
      
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(uploadsDir, filename);
      
      await fsPromises.writeFile(filePath, imageBuffer);
      
      return res.status(200).json({ path: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}