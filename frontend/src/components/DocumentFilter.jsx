import { useState, useEffect } from 'react';
import { getDocuments } from '../services/api';

export default function DocumentFilter({ selectedDocId, onSelect }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const result = await getDocuments();
                setDocuments(result.documents || []);
            } catch (err) {
                console.error("Failed to load documents", err);
            } finally {
                setLoading(false);
            }
        };
        loadDocs();
    }, []);

    if (loading) return <div className="animate-pulse h-10 w-48 bg-slate-800/50 rounded-xl"></div>;

    return (
        <div className="relative">
            <select
                value={selectedDocId || ''}
                onChange={(e) => onSelect(e.target.value || null)}
                className="appearance-none bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 text-white pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500/50 hover:bg-slate-800 transition-colors cursor-pointer min-w-[200px]"
            >
                <option value="">All Documents</option>
                {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                        {doc.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
            </div>
        </div>
    );
}
