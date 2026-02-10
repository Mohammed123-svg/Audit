/**
 * Recommendations Page - Enhanced UI
 * Displays AI recommendations with structured, readable format
 */
import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import DocumentFilter from '../components/DocumentFilter';

export default function RecommendationsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocId, setSelectedDocId] = useState(null);

    useEffect(() => {
        loadRecommendations();
    }, [selectedDocId]);

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            const result = await getRecommendations(selectedDocId);
            setData(result);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load recommendations');
            setLoading(false);
        }
    };

    // Parse AI recommendation text into structured sections
    const parseRecommendation = (text) => {
        if (!text) return null;

        // Clean up markdown formatting first
        const cleanText = text
            .replace(/\*\*/g, '')  // Remove bold markers
            .replace(/\*/g, '')    // Remove italic markers  
            .trim();

        const sections = {
            issue: '',
            why: '',
            actions: []
        };

        // Try to extract structured sections from the new AI format
        const issueMatch = cleanText.match(/1\.\s*ISSUE IDENTIFIED[:\s]*([\s\S]*?)(?=2\.|$)/i);
        const whyMatch = cleanText.match(/2\.\s*WHY IT MATTERS[:\s]*([\s\S]*?)(?=3\.|$)/i);
        const actionMatch = cleanText.match(/3\.\s*RECOMMENDED ACTION[:\s]*([\s\S]*?)$/i);

        if (issueMatch) {
            sections.issue = issueMatch[1].trim().replace(/^[-•]\s*/gm, '');
        }

        if (whyMatch) {
            sections.why = whyMatch[1].trim().replace(/^[-•]\s*/gm, '');
        }

        if (actionMatch) {
            // Split actions by line breaks or bullet points
            const actionText = actionMatch[1].trim();
            const actionLines = actionText.split(/\n|(?=[-•])/g)
                .map(line => line.trim().replace(/^[-•]\s*/, ''))
                .filter(line => line.length > 0);
            sections.actions = actionLines;
        }

        // Fallback: if structured parsing didn't work, try to extract key info
        if (!sections.issue && !sections.why && sections.actions.length === 0) {
            // Look for sentences with key phrases
            const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);

            sentences.forEach(sentence => {
                const lower = sentence.toLowerCase();
                if ((lower.includes('fail') || lower.includes('lack') || lower.includes('missing') || lower.includes('does not')) && !sections.issue) {
                    sections.issue = sentence;
                } else if ((lower.includes('risk') || lower.includes('consequence') || lower.includes('matter')) && !sections.why) {
                    sections.why = sentence;
                } else if (lower.includes('should') || lower.includes('must') || lower.includes('create') || lower.includes('implement') || lower.includes('add')) {
                    sections.actions.push(sentence);
                }
            });
        }

        // Last fallback: just show the whole cleaned text as issue
        if (!sections.issue && !sections.why && sections.actions.length === 0) {
            sections.issue = cleanText;
        }

        return sections;
    };

    const getPriorityColor = (status, score) => {
        if (status === 'Non-Compliant' || score < 0.45) {
            return { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/30', text: 'text-rose-400', label: 'Critical' };
        }
        if (score < 0.55) {
            return { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'High' };
        }
        return { bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Medium' };
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading recommendations...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center">
                    <p className="text-rose-400 mb-4">{error}</p>
                    <button onClick={loadRecommendations} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const recommendations = data?.recommendations || [];

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Recommendations</h1>
                        <p className="text-slate-400">Actionable insights to improve your compliance posture</p>
                    </div>
                </div>
                <DocumentFilter selectedDocId={selectedDocId} onSelect={setSelectedDocId} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 backdrop-blur-xl rounded-2xl border border-rose-500/20 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                            <span className="text-lg">🚨</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-rose-400">
                                {recommendations.filter(r => r.status === 'Non-Compliant' || r.similarity_score < 0.45).length}
                            </p>
                            <p className="text-sm text-slate-400">Critical Issues</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <span className="text-lg">⚠️</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-400">
                                {recommendations.filter(r => r.status === 'Partial' && r.similarity_score >= 0.45).length}
                            </p>
                            <p className="text-sm text-slate-400">Improvements Needed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-lg">📋</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-indigo-400">{recommendations.length}</p>
                            <p className="text-sm text-slate-400">Total Recommendations</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* No Recommendations */}
            {recommendations.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        No compliance issues found. Run audits on your documents to get AI-powered recommendations.
                    </p>
                </div>
            ) : (
                /* Recommendation Cards */
                <div className="space-y-6">
                    {recommendations.map((rec, idx) => {
                        const priority = getPriorityColor(rec.status, rec.similarity_score);
                        const parsed = parseRecommendation(rec.recommendation);

                        return (
                            <div
                                key={`${rec.audit_id}-${rec.control_id}-${idx}`}
                                className={`bg-gradient-to-br ${priority.bg} backdrop-blur-xl rounded-2xl border ${priority.border} overflow-hidden transition-all hover:shadow-lg hover:shadow-${priority.text}/10`}
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-slate-700/30">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${priority.text} bg-slate-900/50`}>
                                                    {priority.label} Priority
                                                </span>
                                                <span className="text-slate-500 text-sm">
                                                    {rec.framework_id?.toUpperCase()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {rec.control_id}: {rec.control_title}
                                            </h3>
                                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                                <span>📄</span> {rec.document_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${priority.text}`}>
                                                {(rec.similarity_score * 100).toFixed(0)}%
                                            </div>
                                            <p className="text-slate-500 text-xs">Match Score</p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Insights - Structured Display */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <span>🤖</span>
                                        </div>
                                        <h4 className="font-semibold text-violet-400">AI Analysis & Recommendations</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Issue Identified */}
                                        {parsed && parsed.issue && (
                                            <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                                                <h5 className="text-rose-400 font-semibold text-sm mb-3 flex items-center gap-2">
                                                    <span>❌</span> Issue Identified
                                                </h5>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {parsed.issue}
                                                </p>
                                            </div>
                                        )}

                                        {/* Why It Matters */}
                                        {parsed && parsed.why && (
                                            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                                                <h5 className="text-amber-400 font-semibold text-sm mb-3 flex items-center gap-2">
                                                    <span>⚠️</span> Why It Matters
                                                </h5>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {parsed.why}
                                                </p>
                                            </div>
                                        )}

                                        {/* Recommended Actions */}
                                        {parsed && parsed.actions && parsed.actions.length > 0 && (
                                            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                                                <h5 className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-2">
                                                    <span>✅</span> Recommended Actions
                                                </h5>
                                                <ul className="space-y-2">
                                                    {parsed.actions.map((action, i) => (
                                                        <li key={i} className="text-slate-300 text-sm pl-4 border-l-2 border-emerald-500/50 leading-relaxed">
                                                            {action}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Fallback: Show raw text if parsing failed */}
                                        {parsed && !parsed.issue && !parsed.why && (!parsed.actions || parsed.actions.length === 0) && rec.recommendation && (
                                            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {rec.recommendation}
                                                </p>
                                            </div>
                                        )}
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
