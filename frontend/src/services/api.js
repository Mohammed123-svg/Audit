/**
 * API service for AI-Powered Compliance Auditor
 * Handles all HTTP requests to the Flask backend
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Upload document file
 * @param {File} file - Document file (PDF/DOCX/TXT)
 * @returns {Promise} Response with document_id, filename, chunks, status
 */
export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Get list of available frameworks
 * @returns {Promise} Array of frameworks with id, name, control_count, source
 */
export const getFrameworks = async () => {
    const response = await api.get('/frameworks');
    return response.data;
};

/**
 * Create compliance audit
 * @param {string} documentId - Document UUID
 * @param {string[]} frameworkIds - Array of framework IDs
 * @returns {Promise} Response with audit_id and status
 */
export const createAudit = async (documentId, frameworkIds) => {
    const response = await api.post('/audit', {
        document_id: documentId,
        framework_ids: frameworkIds,
    });

    return response.data;
};

/**
 * Get audit results
 * @param {string} auditId - Audit UUID
 * @returns {Promise} Complete audit results
 */
export const getResults = async (auditId) => {
    const response = await api.get(`/results/${auditId}`);
    return response.data;
};

/**
 * Get dashboard data
 * @param {string} [documentId] - Optional document UUID to filter stats
 * @returns {Promise} Dashboard summary with recent audits and stats
 */
export const getDashboardData = async (documentId = null) => {
    const params = documentId ? { document_id: documentId } : {};
    const response = await api.get('/dashboard', { params });
    return response.data;
};

/**
 * Get all findings (Partial and Non-Compliant)
 * @param {string} [documentId] - Optional document UUID to filter findings
 * @returns {Promise} Array of findings from all audits
 */
export const getFindings = async (documentId = null) => {
    const params = documentId ? { document_id: documentId } : {};
    const response = await api.get('/findings', { params });
    return response.data;
};

/**
 * Get AI recommendations
 * @param {string} [documentId] - Optional document UUID to filter recommendations
 * @returns {Promise} Array of recommendations with AI explanations
 */
export const getRecommendations = async (documentId = null) => {
    const params = documentId ? { document_id: documentId } : {};
    const response = await api.get('/recommendations', { params });
    return response.data;
};

/**
 * Get list of audited documents
 * @returns {Promise} Array of documents {id, name, date}
 */
export const getDocuments = async () => {
    const response = await api.get('/documents');
    return response.data;
};

export default api;
