/**
 * Results Page - Enhanced UI
 * Displays compliance audit results with premium design
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getResults } from '../services/api';
import ResultsTable from '../components/ResultsTable';

export default function ResultsPage() {
    const { auditId } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResults();
    }, [auditId]);

    const loadResults = async () => {
        try {
            const data = await getResults(auditId);
            setAudit(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load results');
            setLoading(false);
        }
    };

    const getScoreGradient = (score) => {
        if (score >= 75) return 'from-emerald-400 to-teal-500';
        if (score >= 55) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-red-500';
    };

    const getScoreLabel = (score) => {
        if (score >= 75) return 'Good Standing';
        if (score >= 55) return 'Needs Improvement';
        return 'Critical Issues';
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-3xl">📋</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium">Loading audit results...</p>
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
                    <button onClick={loadResults} className="btn-primary">Retry</button>
                </div>
            </div>
        );
    }

    const overallScore = audit?.overall_score || 0;

    return (
        <div className="p-8">
            {/* Header Card with Score */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 mb-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-medium">
                                Audit Complete
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {audit?.document_name || 'Audit Results'}
                        </h1>
                        <p className="text-slate-400">
                            Compliance analysis across {audit?.results?.length || 0} framework(s)
                        </p>
                    </div>

                    {/* Score Ring */}
                    <div className="flex items-center gap-6 bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="relative w-28 h-28">
                            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                                <circle
                                    cx="50" cy="50" r="40"
                                    stroke="url(#resultScoreGradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${overallScore * 2.51} 251`}
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="resultScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={overallScore >= 75 ? '#34d399' : overallScore >= 55 ? '#fbbf24' : '#f87171'} />
                                        <stop offset="100%" stopColor={overallScore >= 75 ? '#14b8a6' : overallScore >= 55 ? '#f97316' : '#ef4444'} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-3xl font-bold bg-gradient-to-r ${getScoreGradient(overallScore)} bg-clip-text text-transparent`}>
                                    {overallScore.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Overall Score</p>
                            <p className={`text-lg font-bold bg-gradient-to-r ${getScoreGradient(overallScore)} bg-clip-text text-transparent`}>
                                {getScoreLabel(overallScore)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results by Framework */}
            {audit?.results && audit.results.map((frameworkResult, idx) => (
                <div key={idx} className="mb-8">
                    {/* Framework Header */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 mb-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <span className="text-xl">🏷️</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {frameworkResult.framework_id?.toUpperCase() || 'Framework'}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {frameworkResult.results?.length || 0} controls analyzed
                                </p>
                            </div>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-1">
                                    {frameworkResult.status_counts?.Compliant || 0}
                                </div>
                                <div className="text-sm text-emerald-400/80">Compliant</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/30 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-amber-400 mb-1">
                                    {frameworkResult.status_counts?.Partial || 0}
                                </div>
                                <div className="text-sm text-amber-400/80">Partial</div>
                            </div>
                            <div className="bg-gradient-to-br from-rose-500/15 to-rose-600/5 border border-rose-500/30 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-rose-400 mb-1">
                                    {frameworkResult.status_counts?.['Non-Compliant'] || 0}
                                </div>
                                <div className="text-sm text-rose-400/80">Non-Compliant</div>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 border border-indigo-500/30 rounded-xl p-4 text-center">
                                <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreGradient(frameworkResult.overall_score || 0)} bg-clip-text text-transparent`}>
                                    {(frameworkResult.overall_score || 0).toFixed(0)}%
                                </div>
                                <div className="text-sm text-indigo-400/80">Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Results Table */}
                    <ResultsTable results={frameworkResult.results || []} />
                </div>
            ))}

            {/* Footer Actions */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        Audit ID: <code className="text-slate-400">{audit?.audit_id}</code>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all"
                        >
                            ← Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/upload')}
                            className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                        >
                            Upload New Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
