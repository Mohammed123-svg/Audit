/**
 * Upload Page - Enhanced UI
 * Beautiful document upload with drag and drop
 */
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

export default function UploadPage() {
    const navigate = useNavigate();

    const handleUploadSuccess = (result) => {
        navigate(`/select-framework/${result.document_id}`, {
            state: { documentInfo: result }
        });
    };

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30">
                    <span className="text-4xl">📤</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Upload Document</h1>
                <p className="text-slate-400 text-lg max-w-lg mx-auto">
                    Upload your compliance document for AI-powered analysis and get instant insights
                </p>
            </div>

            {/* Upload Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 mb-10 shadow-2xl">
                <UploadForm onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* How it works - Enhanced Cards */}
            <div className="mb-8">
                <h3 className="text-center text-xl font-bold text-white mb-8">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/10">
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            1
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">📄</span>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Upload</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Drag & drop or browse to upload your compliance document (PDF, DOCX, or TXT)
                        </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/3 -translate-x-1/2 translate-y-12">
                        <div className="text-slate-600 text-2xl">→</div>
                    </div>

                    {/* Step 2 */}
                    <div className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-cyan-500/30 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            2
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">Select Frameworks</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Choose from GDPR, HIPAA, SOC 2, and other compliance frameworks to audit against
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            3
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🤖</span>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">AI Analysis</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Get semantic similarity scores, gap analysis, and AI-powered recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Supported Formats */}
            <div className="text-center">
                <p className="text-slate-500 text-sm mb-3">Supported file formats</p>
                <div className="flex justify-center gap-3">
                    <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium">
                        📕 PDF
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium">
                        📘 DOCX
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium">
                        📝 TXT
                    </span>
                </div>
            </div>
        </div>
    );
}
