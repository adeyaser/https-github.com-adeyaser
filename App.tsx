
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

// App Views routing mapping
type ViewType = '/' | '/students' | '/classes' | '/learning' | '/attendance' | '/assessment' | '/elearning' | '/games' | '/chats' | '/reports' | '/materials' | '/enrollments' | '/settings';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<ViewType>('/');

  const renderView = () => {
    switch (currentPath) {
      case '/':
        return <DashboardView />;
      case '/students':
        return <StudentsView />;
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
        return <ReportsView />;
      case '/materials':
        return <MaterialsView />;
      case '/enrollments':
        return <EnrollmentsView />;
      case '/settings':
        return <SettingsView />;
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

  return (
    <Layout activePath={currentPath} onNavigate={(path) => setCurrentPath(path as ViewType)}>
      {renderView()}
    </Layout>
  );
};

export default App;
