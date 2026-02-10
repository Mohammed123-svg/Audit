/**
 * Upload Form Component - Enhanced
 * Beautiful drag and drop with animations
 */
import { useState, useRef } from 'react';
import { uploadDocument } from '../services/api';

export default function UploadForm({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const allowedExtensions = ['.pdf', '.docx', '.txt'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            setError('Please upload a PDF, DOCX, or TXT file');
            return;
        }

        setFile(file);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const result = await uploadDocument(file);
            onUploadSuccess(result);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload document. Please try again.');
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div>
            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${dragActive
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : file
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-slate-600 hover:border-slate-500 bg-slate-900/30'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                />

                <div className="p-10 text-center">
                    {file ? (
                        <div className="relative">
                            {/* Success State */}
                            <div className="w-20 h-20 mx-auto mb-5 relative">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 animate-pulse"></div>
                                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <span className="text-3xl">📄</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-slate-800 flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            </div>
                            <p className="text-white font-bold text-lg mb-1">{file.name}</p>
                            <p className="text-slate-400 text-sm mb-4">
                                {formatFileSize(file.size)}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                                className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-700/50"
                            >
                                Choose different file
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* Empty State */}
                            <div className="w-20 h-20 mx-auto mb-5 relative">
                                <div className={`absolute inset-0 rounded-2xl transition-all ${dragActive ? 'bg-indigo-500/20 scale-110' : 'bg-slate-800'}`}></div>
                                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center">
                                    <span className={`text-4xl transition-transform ${dragActive ? 'scale-125' : ''}`}>📁</span>
                                </div>
                            </div>
                            <p className="text-white font-semibold text-lg mb-2">
                                <span className="text-indigo-400">Choose a file</span> or drag and drop
                            </p>
                            <p className="text-slate-500 text-sm">
                                PDF, DOCX, or TXT up to 16MB
                            </p>
                        </div>
                    )}
                </div>

                {/* Animated Border on Drag */}
                {dragActive && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 animate-pulse"></div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mt-5 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <span>⚠️</span>
                    </div>
                    <p className="text-rose-400 text-sm">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!file || uploading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${file && !uploading
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
            >
                {uploading ? (
                    <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing document...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <span>📤</span> Upload and Process
                    </span>
                )}
            </button>
        </div>
    );
}
