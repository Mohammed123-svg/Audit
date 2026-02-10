/**
 * Results Table Component - Enhanced
 * Displays compliance results with beautiful cards
 */
import { useState } from 'react';

export default function ResultsTable({ results }) {
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (controlId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(controlId)) {
                newSet.delete(controlId);
            } else {
                newSet.add(controlId);
            }
            return newSet;
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Compliant':
                return {
                    gradient: 'from-emerald-500/15 to-emerald-600/5',
                    border: 'border-emerald-500/30',
                    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    icon: '✓',
                    label: 'Compliant'
                };
            case 'Partial':
                return {
                    gradient: 'from-amber-500/15 to-amber-600/5',
                    border: 'border-amber-500/30',
                    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    icon: '⚠',
                    label: 'Partial'
                };
            default:
                return {
                    gradient: 'from-rose-500/15 to-rose-600/5',
                    border: 'border-rose-500/30',
                    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                    icon: '✗',
                    label: 'Non-Compliant'
                };
        }
    };

    const getScoreGradient = (score) => {
        if (score >= 0.75) return 'from-emerald-400 to-teal-500';
        if (score >= 0.55) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-red-500';
    };

    return (
        <div className="space-y-4">
            {results.map((result) => {
                const config = getStatusConfig(result.status);

                return (
                    <div
                        key={result.control_id}
                        className={`bg-gradient-to-br ${config.gradient} backdrop-blur-xl rounded-2xl border ${config.border} overflow-hidden transition-all hover:shadow-lg`}
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Status Icon */}
                                <div className={`w-12 h-12 rounded-xl ${config.badge} flex items-center justify-center flex-shrink-0 text-xl`}>
                                    {config.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-1">
                                                {result.control_id}: {result.control_title}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${config.badge}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-2xl font-bold bg-gradient-to-r ${getScoreGradient(result.similarity_score)} bg-clip-text text-transparent`}>
                                                {(result.similarity_score * 100).toFixed(0)}%
                                            </div>
                                            <p className="text-slate-500 text-xs">Match</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                        {result.control_description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(result.similarity_score)} transition-all duration-500`}
                                                style={{ width: `${result.similarity_score * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Matched Text Toggle */}
                                    <button
                                        onClick={() => toggleRow(result.control_id)}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-xs">{expandedRows.has(result.control_id) ? '▼' : '▶'}</span>
                                        View matched document text
                                    </button>

                                    {expandedRows.has(result.control_id) && (
                                        <div className="mt-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                            <p className="text-slate-400 text-sm italic leading-relaxed">
                                                "{result.matched_text}"
                                            </p>
                                        </div>
                                    )}

                                    {/* AI Explanation for non-compliant items */}
                                    {result.status !== 'Compliant' && (
                                        <div className="mt-4 p-5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg">🤖</span>
                                                </div>
                                                <div>
                                                    <p className="text-indigo-400 text-xs font-bold mb-2">AI Analysis & Recommendation</p>
                                                    {result.ai_explanation ? (
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            {result.ai_explanation}
                                                        </p>
                                                    ) : (
                                                        <p className="text-slate-500 text-sm italic">
                                                            AI explanation not available for this control.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
