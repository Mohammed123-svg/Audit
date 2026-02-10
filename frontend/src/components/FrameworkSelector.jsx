/**
 * Framework Selector Component - Enhanced
 * Beautiful framework selection with hover effects
 */
import { useState, useEffect } from 'react';
import { getFrameworks } from '../services/api';

export default function FrameworkSelector({ onSubmit }) {
    const [frameworks, setFrameworks] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFrameworks();
    }, []);

    const loadFrameworks = async () => {
        try {
            const data = await getFrameworks();
            setFrameworks(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load frameworks. Please refresh the page.');
            setLoading(false);
        }
    };

    const toggleFramework = (id) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        if (selected.size > 0) {
            onSubmit(Array.from(selected));
        }
    };

    const getFrameworkIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('gdpr')) return '🇪🇺';
        if (lower.includes('hipaa')) return '🏥';
        if (lower.includes('soc')) return '🔒';
        if (lower.includes('iso')) return '📋';
        if (lower.includes('pci')) return '💳';
        if (lower.includes('nist')) return '🛡️';
        return '📜';
    };

    const getFrameworkGradient = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('gdpr')) return 'from-blue-500 to-indigo-600';
        if (lower.includes('hipaa')) return 'from-rose-500 to-pink-600';
        if (lower.includes('soc')) return 'from-emerald-500 to-teal-600';
        if (lower.includes('iso')) return 'from-amber-500 to-orange-600';
        if (lower.includes('pci')) return 'from-violet-500 to-purple-600';
        if (lower.includes('nist')) return 'from-cyan-500 to-blue-600';
        return 'from-slate-500 to-slate-600';
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium">Loading frameworks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-rose-400">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-2">Available Frameworks</h2>
            <p className="text-slate-400 text-sm mb-6">Select one or more frameworks to audit against</p>

            {/* Framework Cards */}
            <div className="space-y-3 mb-8">
                {frameworks.map((framework) => {
                    const isSelected = selected.has(framework.id);
                    const icon = getFrameworkIcon(framework.name);
                    const gradient = getFrameworkGradient(framework.name);

                    return (
                        <div
                            key={framework.id}
                            onClick={() => toggleFramework(framework.id)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all group ${isSelected
                                ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Checkbox */}
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-500'
                                    : 'border-slate-600 group-hover:border-slate-500'
                                    }`}>
                                    {isSelected && (
                                        <span className="text-white text-sm font-bold">✓</span>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isSelected
                                    ? `bg-gradient-to-br ${gradient} shadow-lg`
                                    : 'bg-slate-800 border border-slate-700'
                                    }`}>
                                    <span className="text-2xl">{icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                        }`}>
                                        {framework.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Source: {framework.source}
                                    </p>
                                </div>

                                {/* Control Count */}
                                <div className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isSelected
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                                    }`}>
                                    {framework.control_count} controls
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Validation */}
            {selected.size === 0 && (
                <div className="text-center mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-slate-400 text-sm">
                        👆 Select at least one framework to continue
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={selected.size === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selected.size > 0
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
            >
                {selected.size > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                        <span>🚀</span> Run Compliance Audit ({selected.size} framework{selected.size > 1 ? 's' : ''})
                    </span>
                ) : (
                    'Select a framework to continue'
                )}
            </button>
        </div>
    );
}
