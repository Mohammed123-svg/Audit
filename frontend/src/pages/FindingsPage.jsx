/**
 * Findings Page - Enhanced UI
 * Displays all compliance findings with beautiful cards
 */
import { useState, useEffect } from 'react';
import { getFindings } from '../services/api';
import DocumentFilter from '../components/DocumentFilter';

export default function FindingsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedDocId, setSelectedDocId] = useState(null);

    useEffect(() => {
        loadFindings();
    }, [selectedDocId]);

    const loadFindings = async () => {
        setLoading(true);
        try {
            const result = await getFindings(selectedDocId);
            setData(result);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load findings');
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        if (status === 'Non-Compliant') {
            return {
                gradient: 'from-rose-500/20 to-rose-600/10',
                border: 'border-rose-500/30',
                badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                icon: '❌',
                label: 'Non-Compliant'
            };
        }
        return {
            gradient: 'from-amber-500/20 to-amber-600/10',
            border: 'border-amber-500/30',
            badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            icon: '⚠️',
            label: 'Partial'
        };
    };

    const getScoreColor = (score) => {
        if (score >= 0.55) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-red-500';
    };

    const filteredFindings = data?.findings?.filter(f => {
        if (filter === 'all') return true;
        return f.status === filter;
    }) || [];

    const nonCompliantCount = data?.findings?.filter(f => f.status === 'Non-Compliant').length || 0;
    const partialCount = data?.findings?.filter(f => f.status === 'Partial').length || 0;

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-2xl">🔍</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium">Loading findings...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-rose-400 mb-4">{error}</p>
                    <button onClick={loadFindings} className="btn-primary">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <span className="text-2xl">🔍</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Findings</h1>
                        <p className="text-slate-400">Compliance issues that need your attention</p>
                    </div>
                </div>
                <DocumentFilter selectedDocId={selectedDocId} onSelect={setSelectedDocId} />
            </div>

            {/* Filter Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2 mb-8 inline-flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'all'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                >
                    All Findings
                    <span className="ml-2 px-2 py-0.5 rounded-lg bg-white/10 text-xs">{data?.total || 0}</span>
                </button>
                <button
                    onClick={() => setFilter('Non-Compliant')}
                    className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'Non-Compliant'
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                >
                    Critical
                    <span className="ml-2 px-2 py-0.5 rounded-lg bg-white/10 text-xs">{nonCompliantCount}</span>
                </button>
                <button
                    onClick={() => setFilter('Partial')}
                    className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'Partial'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                >
                    Partial
                    <span className="ml-2 px-2 py-0.5 rounded-lg bg-white/10 text-xs">{partialCount}</span>
                </button>
            </div>

            {/* Findings List */}
            {filteredFindings.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-16 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Looking Good!</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        {filter === 'all'
                            ? 'No compliance issues found. Upload a document and run an audit to check compliance.'
                            : `No ${filter.toLowerCase()} findings. Great job maintaining compliance!`}
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredFindings.map((finding, idx) => {
                        const config = getStatusConfig(finding.status);

                        return (
                            <div
                                key={`${finding.audit_id}-${finding.control_id}-${idx}`}
                                className={`bg-gradient-to-br ${config.gradient} backdrop-blur-xl rounded-2xl border ${config.border} overflow-hidden transition-all hover:shadow-lg`}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${config.badge}`}>
                                                    {config.icon} {config.label}
                                                </span>
                                                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50">
                                                    {finding.framework_id?.toUpperCase()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {finding.control_id}: {finding.control_title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {finding.control_description}
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16">
                                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                                                    <circle cx="30" cy="30" r="24" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-700" />
                                                    <circle
                                                        cx="30" cy="30" r="24"
                                                        stroke="url(#findingGradient)"
                                                        strokeWidth="6"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${finding.similarity_score * 150.8} 150.8`}
                                                    />
                                                    <defs>
                                                        <linearGradient id="findingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor={finding.similarity_score >= 0.55 ? '#fbbf24' : '#f87171'} />
                                                            <stop offset="100%" stopColor={finding.similarity_score >= 0.55 ? '#f97316' : '#ef4444'} />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className={`text-sm font-bold bg-gradient-to-r ${getScoreColor(finding.similarity_score)} bg-clip-text text-transparent`}>
                                                        {(finding.similarity_score * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-xs mt-1">Match</p>
                                        </div>
                                    </div>

                                    {/* Document Info */}
                                    <div className="flex items-center gap-4 text-sm mb-4 p-3 rounded-xl bg-slate-900/30 border border-slate-700/30">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <span>📄</span> {finding.document_name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
