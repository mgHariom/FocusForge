import {Router} from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { chunkText } from '../utils/chunkText.js';

const documentRouter = Router();
const upload = multer({dest: 'uploads/'});

documentRouter.post('/upload', upload.single('document'), async (req, res) => {
    const file = req.file;

    if(!file) {
        return res.status(400).json({message: 'No file uploaded'});
    };

    try {
        const filePath = path.resolve(file.path);
        const ext = path.extname(file.originalname).toLowerCase();
        let extractedText = '';

        if(ext === '.pdf'){
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } else if (ext == '.docx') {
            const result = await mammoth.extractRawText({path: filePath});
            extractedText = result.value;
        } else if (ext == '.txt') {
            extractedText = fs.readFileSync(filePath, 'utf-8');
        } else {
            return res.status(400).json({error: 'Unsupported file type'});
        }

        //Delete uploaded file after extraction
        fs.unlinkSync(file.path);

        //chunking extracted text
        const chunks = chunkText(extractedText);

        //Extracted text
        res.status(200).json({
            success: true,
            chunks,
            message: 'Text extracted and chunked successfully',
        });

    } catch (error) {
        console.log('File processing error:', error);
        res.status(500).json({error: 'Failed to process file'})        
    }
})

export default documentRouter;