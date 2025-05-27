import {Router} from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import storeDocumentChunks, { chunkText } from '../utils/chunkText.js';
// import {searchDocumentFunction} from '../routes/documentSearch.routes.js';

const documentRouter = Router();
const upload = multer({dest: 'uploads/'});

documentRouter.post('/upload', upload.single('document'), async (req, res) => {
    const file = req.file;

    if(!file) {
        return res.status(400).json({message: 'No file uploaded'});
    }

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

        fs.unlinkSync(file.path);

        const chunks = chunkText(extractedText);

        // Store chunks and search, then send response
        try {
            const query = "What is the main topic of this document?";
            const top_k = 3; 
            await storeDocumentChunks(chunks, file.filename);
            // If you have a search function (not a router), call it here:
             const searchResults = await searchDocumentFunction(query, top_k);

            res.status(200).json({
                success: true,
                chunks,
                message: 'Text extracted, chunked, and stored successfully',
                // searchResults: searchResults, // include if you want to return search results
            });
        } catch (error) {
            console.error('Error storing chunks or searching:', error);
            res.status(500).json({error: 'Failed to store chunks or search'});
        }

    } catch (error) {
        console.log('File processing error:', error);
        res.status(500).json({error: 'Failed to process file'});
    }
});

export default documentRouter;