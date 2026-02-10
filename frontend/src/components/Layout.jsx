/**
 * Layout Component - Enhanced Sidebar
 * Modern navigation with gradient effects
 */
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊', gradient: 'from-indigo-500 to-purple-600' },
        { path: '/upload', label: 'Upload Document', icon: '📤', gradient: 'from-cyan-500 to-blue-600' },
        { path: '/findings', label: 'Findings', icon: '🔍', gradient: 'from-amber-500 to-orange-600' },
        { path: '/recommendations', label: 'Recommendations', icon: '💡', gradient: 'from-violet-500 to-purple-600' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900/80 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col fixed h-full">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800/50">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all group-hover:scale-105">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg">Compliance</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">AI AUDITOR</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative group ${isActive(item.path)
                                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            {/* Active indicator */}
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500"></div>
                            )}

                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive(item.path)
                                ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                                : 'bg-slate-800 group-hover:bg-slate-700'
                                }`}>
                                <span className="text-lg">{item.icon}</span>
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800/50">
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span>🤖</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">AI Powered</p>
                                <p className="text-slate-400 text-xs">DeepSeek R1</p>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Using advanced AI for accurate compliance analysis
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 min-h-screen">
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
