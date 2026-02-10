/**
 * Main App Component
 * Sets up routing for the AI-Powered Compliance Auditor with modern layout
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import SelectFrameworkPage from './pages/SelectFrameworkPage';
import ResultsPage from './pages/ResultsPage';
import FindingsPage from './pages/FindingsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import './index.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/select-framework/:documentId" element={<SelectFrameworkPage />} />
                    <Route path="/results/:auditId" element={<ResultsPage />} />
                    <Route path="/findings" element={<FindingsPage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
