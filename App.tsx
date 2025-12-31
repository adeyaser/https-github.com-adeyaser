
import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import AttendanceView from './components/AttendanceView';
import LearningView from './components/LearningView';
import AssessmentView from './components/AssessmentView';
import ElearningView from './components/ElearningView';
import GamesView from './components/GamesView';
import ClassesView from './components/ClassesView';
import ChatView from './components/ChatView';
import ReportsView from './components/ReportsView';
import MaterialsView from './components/MaterialsView';
import EnrollmentsView from './components/EnrollmentsView';
import SettingsView from './components/SettingsView';
import LandingView from './components/LandingView';
import LoginView from './components/LoginView';
import FinanceView from './components/FinanceView';
import GalleryView from './components/GalleryView';
import PublicCurriculumView from './components/PublicCurriculumView';
import PublicAboutView from './components/PublicAboutView';
import PublicGalleryView from './components/PublicGalleryView';

type ViewType = '/' | '/students' | '/classes' | '/learning' | '/attendance' | '/assessment' | '/elearning' | '/games' | '/chats' | '/reports' | '/materials' | '/enrollments' | '/settings' | '/finance' | '/gallery' | '/curriculum' | '/about' | '/public-gallery';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginView, setIsLoginView] = useState(false);
  const [currentPath, setCurrentPath] = useState<ViewType>('/');
  const [user, setUser] = useState<any>(null);
  const [selectedStudentIdForReport, setSelectedStudentIdForReport] = useState<number | null>(null);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoginView(false);
    setCurrentPath('/');
  };

  const handleNavigation = (path: string, studentId?: number) => {
    if (studentId) {
      setSelectedStudentIdForReport(studentId);
    }
    setCurrentPath(path as ViewType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDashboardView = () => {
    switch (currentPath) {
      case '/':
        return <DashboardView onNavigate={handleNavigation} />;
      case '/students':
        return <StudentsView onNavigate={handleNavigation} />;
      case '/classes':
        return <ClassesView />;
      case '/learning':
        return <LearningView />;
      case '/attendance':
        return <AttendanceView />;
      case '/assessment':
        return <AssessmentView />;
      case '/elearning':
        return <ElearningView />;
      case '/games':
        return <GamesView />;
      case '/chats':
        return <ChatView />;
      case '/reports':
        return (
          <ReportsView 
            initialStudentId={selectedStudentIdForReport} 
            onClearInitial={() => setSelectedStudentIdForReport(null)}
          />
        );
      case '/materials':
        return <MaterialsView />;
      case '/enrollments':
        return <EnrollmentsView />;
      case '/settings':
        return <SettingsView />;
      case '/finance':
        return <FinanceView />;
      case '/gallery':
        return <GalleryView />;
      case '/curriculum':
        return <PublicCurriculumView onBack={() => setCurrentPath('/')} />;
      case '/about':
        return <PublicAboutView onBack={() => setCurrentPath('/')} />;
      case '/public-gallery':
        return <PublicGalleryView onBack={() => setCurrentPath('/')} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🚧</span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Modul Sedang Dikembangkan</h2>
              <p className="text-sm">Halaman ini akan segera hadir dengan fitur Montessori lengkap!</p>
            </div>
            <button 
              onClick={() => setCurrentPath('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md"
            >
              Kembali ke Dashboard
            </button>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    if (currentPath === '/curriculum') {
      return <PublicCurriculumView onBack={() => setCurrentPath('/')} />;
    }
    if (currentPath === '/about') {
      return <PublicAboutView onBack={() => setCurrentPath('/')} />;
    }
    if (currentPath === '/public-gallery') {
      return <PublicGalleryView onBack={() => setCurrentPath('/')} />;
    }
    if (isLoginView) {
      return <LoginView onLoginSuccess={handleLoginSuccess} onBack={() => setIsLoginView(false)} />;
    }
    return <LandingView onLoginClick={() => setIsLoginView(true)} onNavigate={handleNavigation} />;
  }

  return (
    <Layout 
      activePath={currentPath} 
      onNavigate={handleNavigation}
    >
      {renderDashboardView()}
    </Layout>
  );
};

export default App;
