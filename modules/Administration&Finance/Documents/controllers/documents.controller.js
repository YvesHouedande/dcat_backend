const documentService = require('../services/documents.service');


const createDocument = async (req, res) => {
    try {
        const data = req.body;
        const result = await documentService.createDocument(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating document', error });
    }
}

const getDocuments = async (req, res) => {
    try {
        const documents = await documentService.getDocuments();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
}
