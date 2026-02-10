/**
 * Select Framework Page - Enhanced UI
 * Beautiful framework selection with cards
 */
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import FrameworkSelector from '../components/FrameworkSelector';
import { createAudit } from '../services/api';

export default function SelectFrameworkPage() {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const documentInfo = location.state?.documentInfo;

    const handleSubmit = async (selectedFrameworkIds) => {
        setProcessing(true);
        setError(null);

        try {
            const result = await createAudit(documentId, selectedFrameworkIds);
            navigate(`/results/${result.audit_id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create audit. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
                    <span className="text-4xl">🎯</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Select Frameworks</h1>
                <p className="text-slate-400 text-lg">
                    Choose compliance frameworks to audit your document against
                </p>
            </div>

            {/* Document Info */}
            {documentInfo && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <span className="text-2xl">📄</span>
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">{documentInfo.filename}</p>
                            <p className="text-slate-400 text-sm">
                                {documentInfo.chunks} text chunks ready for analysis
                            </p>
                        </div>
                        <div className="ml-auto">
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                ✓ Processed
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <p className="text-rose-400">{error}</p>
                </div>
            )}

            {/* Processing State */}
            {processing ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden">
                    <div className="text-center py-20">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-3xl">🤖</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Running AI Analysis...
                        </h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            Our AI is analyzing your document against the selected compliance frameworks
                        </p>

                        {/* Progress Steps */}
                        <div className="mt-8 flex justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <span>✓</span> Document parsed
                            </div>
                            <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                                <span>⟳</span> Analyzing controls
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <span>○</span> Generating insights
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
                    <FrameworkSelector onSubmit={handleSubmit} />
                </div>
            )}
        </div>
    );
}
