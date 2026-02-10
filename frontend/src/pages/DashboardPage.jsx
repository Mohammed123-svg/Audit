/**
 * Dashboard Page - Enhanced UI with Recharts
 * Real-time compliance overview with premium interactive charts
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { getDashboardData } from '../services/api';
import DocumentFilter from '../components/DocumentFilter';

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocId, setSelectedDocId] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, [selectedDocId]);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const result = await getDashboardData(selectedDocId);
            setData(result);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard');
            setLoading(false);
        }
    };

    const getScoreGradient = (score) => {
        if (score >= 75) return 'from-emerald-400 to-teal-500';
        if (score >= 55) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-red-500';
    };

    const formatDate = (dateString, format = 'full') => {
        const date = new Date(dateString);
        if (format === 'short') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="p-8 w-full flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 w-full">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md mx-auto">
                    <p className="text-rose-400 mb-4">{error}</p>
                    <button onClick={loadDashboard} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors">Retry</button>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const statusData = [
        { name: 'Compliant', value: data?.stats?.status_breakdown?.Compliant || 0, color: '#10b981' },
        { name: 'Partial', value: data?.stats?.status_breakdown?.Partial || 0, color: '#f59e0b' },
        { name: 'Non-Compliant', value: data?.stats?.status_breakdown?.['Non-Compliant'] || 0, color: '#ef4444' },
    ].filter(item => item.value > 0);

    const trendData = data?.stats?.compliance_trend?.map(item => ({
        ...item,
        date: formatDate(item.date, 'short')
    })) || [];

    const frameworkData = data?.stats?.framework_scores || [];

    const avgScore = data?.stats?.average_score || 0;

    return (
        <div className="p-8 w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-slate-400">Compliance Analytics & Real-time Insights</p>
                </div>
                <DocumentFilter selectedDocId={selectedDocId} onSelect={setSelectedDocId} />
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getScoreGradient(avgScore)} shadow-lg`}>
                        <span className="text-xl">📈</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Avg. Score</p>
                        <p className="text-2xl font-bold text-white">{avgScore.toFixed(1)}%</p>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                        <span className="text-xl">📄</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Documents</p>
                        <p className="text-2xl font-bold text-white">{data?.stats?.total_documents || 0}</p>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                        <span className="text-xl">🔍</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Total Audits</p>
                        <p className="text-2xl font-bold text-white">{data?.stats?.total_audits || 0}</p>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Issues</p>
                        <p className="text-2xl font-bold text-white">
                            {(data?.stats?.status_breakdown?.['Non-Compliant'] || 0) + (data?.stats?.status_breakdown?.Partial || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Row 1: Trends & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compliance Trend Line Chart */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-indigo-500"></span>
                        Compliance Score Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                No trend data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Breakdown Pie Chart */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-emerald-500"></span>
                        Compliance Status
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500">No status data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Frameworks & Recent Audits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Framework Scores Bar Chart */}
                <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-violet-500"></span>
                        Scores by Framework
                    </h3>
                    <div className="h-[300px] w-full">
                        {frameworkData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={frameworkData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#334155', opacity: 0.2 }}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                                        {frameworkData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score >= 70 ? '#10b981' : entry.score >= 50 ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                No framework data
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Audits List */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-8 rounded-full bg-blue-500"></span>
                            Recent Audits
                        </h3>
                        <Link to="/upload" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                            + New Audit
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {data?.recent_audits && data.recent_audits.length > 0 ? (
                            data.recent_audits.map((audit) => (
                                <Link
                                    key={audit.audit_id}
                                    to={`/results/${audit.audit_id}`}
                                    className="block bg-slate-700/30 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-700/50 rounded-xl p-4 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                                                📄
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{audit.document_name}</p>
                                                <div className="flex gap-2 text-xs text-slate-400">
                                                    <span>{formatDate(audit.created_at)}</span>
                                                    <span>•</span>
                                                    <span className="text-slate-300">{audit.framework_ids?.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-lg font-bold bg-gradient-to-r ${getScoreGradient(audit.overall_score)} bg-clip-text text-transparent`}>
                                                {audit.overall_score?.toFixed(1)}%
                                            </div>
                                            <div className="text-xs text-slate-500">Score</div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <p className="mb-4">No audits yet</p>
                                <Link to="/upload" className="text-indigo-400 hover:text-indigo-300">
                                    Upload your first document →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
