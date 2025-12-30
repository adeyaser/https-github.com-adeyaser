
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  Video, 
  Gamepad2, 
  Settings,
  Baby,
  MessageSquare,
  FileText,
  Package,
  UserPlus
} from 'lucide-react';
import { User, LearningArea, Class, Student, DailyActivity, ElearningModule, LearningGame, Quiz, Competency, QuizResult } from './types';

export const APP_NAME = "PAUD Cerdas";

export const BEAD_COLORS = {
  1: '#FF0000', // Red
  2: '#00FF00', // Green
  3: '#FFC0CB', // Pink
  4: '#FFFF00', // Yellow
  5: '#ADD8E6', // Light Blue
  6: '#800080', // Purple
  7: '#FFFFFF', // White
  8: '#8B4513', // Brown
  9: '#0000FF', // Dark Blue
  10: '#FFD700' // Gold
};

export const MOCK_USER: User = {
  user_id: 4,
  username: "guru1",
  email: "guru1@paud.id",
  user_type: "teacher",
  full_name: "Dewi Kartika, S.Pd",
  profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
};

export const LEARNING_AREAS: LearningArea[] = [
  { area_id: 1, area_name: 'Practical Life', color_code: '#FF6B6B', icon: 'home', description: 'Kemandirian & Kehidupan Sehari-hari' },
  { area_id: 2, area_name: 'Sensorial', color_code: '#4ECDC4', icon: 'color_lens', description: 'Pengembangan Panca Indera' },
  { area_id: 3, area_name: 'Mathematics', color_code: '#45B7D1', icon: 'calculate', description: 'Logika & Angka Dasar' },
  { area_id: 4, area_name: 'Language', color_code: '#96CEB4', icon: 'translate', description: 'Literasi & Komunikasi' },
  { area_id: 5, area_name: 'Cultural', color_code: '#FFEAA7', icon: 'public', description: 'Sains, Geografi & Budaya' },
  { area_id: 6, area_name: 'Art & Music', color_code: '#DDA0DD', icon: 'music_note', description: 'Ekspresi Kreatif' }
];

export const MENU_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { name: 'Data Siswa', icon: <Baby size={20} />, path: '/students' },
  { name: 'Pendaftaran', icon: <UserPlus size={20} />, path: '/enrollments' },
  { name: 'Kelas', icon: <School size={20} />, path: '/classes' },
  { name: 'Pembelajaran', icon: <BookOpen size={20} />, path: '/learning' },
  { name: 'Penilaian', icon: <ClipboardCheck size={20} />, path: '/assessment' },
  { name: 'E-Learning', icon: <Video size={20} />, path: '/elearning' },
  { name: 'Pesan', icon: <MessageSquare size={20} />, path: '/chats' },
  { name: 'Rapor', icon: <FileText size={20} />, path: '/reports' },
  { name: 'Material', icon: <Package size={20} />, path: '/materials' },
  { name: 'Games', icon: <Gamepad2 size={20} />, path: '/games' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export const MOCK_STUDENTS: Student[] = [
  { student_id: 1, nis: 'PAUD-2024-0001', full_name: 'Alya Putri Ramadhani', birth_date: '2020-05-15', birth_place: 'Jakarta', gender: 'Perempuan', photo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=150', status: 'Active' },
  { student_id: 2, nis: 'PAUD-2024-0002', full_name: 'Bryan Alexander', birth_date: '2020-03-20', birth_place: 'Bandung', gender: 'Laki-laki', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', status: 'Active' }
];

export const MOCK_CLASSES: Class[] = [
  { class_id: 1, class_name: 'Kelas A-1 (Bulan)', class_level: 'TK A', academic_year: '2024/2025', current_students: 12, max_students: 15 }
];

export const MOCK_COMPETENCIES: Competency[] = [
  { competency_id: 1, area_id: 1, competency_code: 'PL-001', competency_desc: 'Menuang air dari teko', indicator: 'Dapat menuang tanpa tumpah' }
];

export const MOCK_ACTIVITIES: DailyActivity[] = [
  { activity_id: 1, title: 'Praktik Menuang Air', content: 'Hari ini anak-anak belajar kemandirian melalui media air.', activity_date: '2024-03-15', area_id: 1, is_published: true, photos: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'] }
];

export const MOCK_QUIZZES: Quiz[] = [
  { quiz_id: 1, quiz_title: 'Warna Dasar', quiz_type: 'multiple_choice', start_date: '2024-03-15', end_date: '2024-03-20', passing_score: 75 }
];

export const MOCK_QUIZ_RESULTS: QuizResult[] = [
  { result_id: 1, quiz_id: 1, student_id: 1, score: 100, status: 'Pass', completed_at: '2024-03-16 10:00' }
];

export const MOCK_MODULES: ElearningModule[] = [
  { module_id: 1, module_title: 'Angka 1-10', module_description: 'Video belajar berhitung.', class_level: 'TK A', area_id: 3, content_type: 'video', content_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_minutes: 10 }
];

export const MOCK_CHATS = [
  { id: 1, parent: 'Andi', student: 'Alya', lastMsg: 'Sangat bagus!', time: '09:00', photo: 'https://i.pravatar.cc/150?u=1', unread: 1 }
];

export const MOCK_MATERIALS = [
  { id: 1, name: 'Pink Tower', area: 'Sensorial', status: 'Available', shelf: 'A-1', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400' }
];

export const MOCK_ENROLLMENTS = [
  { id: 1, name: 'Dinda Syifa', parent: 'Ibu Ratna', phone: '081234567890', date: '2024-03-10', status: 'Pending' as const }
];

export const MOCK_GAMES: LearningGame[] = [
  { 
    game_id: 1, 
    game_title: 'Tangga Manik (Bead Stair)', 
    game_description: 'Susun manik-manik berwarna sesuai angkanya.', 
    game_type: 'bead_stair', 
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', 
    min_score: 100 
  },
  { 
    game_id: 2, 
    game_title: 'Stamp Game (Penjumlahan)', 
    game_description: 'Gunakan ubin warna untuk menyelesaikan soal matematika.', 
    game_type: 'stamp_game', 
    image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', 
    min_score: 70,
    custom_items: [
      { problem: "12 + 5", answer: 17 }
    ]
  },
  { 
    game_id: 3, 
    game_title: 'Golden Beads Bank', 
    game_description: 'Kumpulkan manik emas sesuai nilai tempatnya.', 
    game_type: 'golden_beads', 
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400', 
    min_score: 80 
  },
  { 
    game_id: 4, 
    game_title: 'Snake Game: Mencari 10', 
    game_description: 'Gabungkan manik berwarna menjadi manik emas bernilai 10.', 
    game_type: 'snake_game', 
    image_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', 
    min_score: 90 
  },
  { 
    game_id: 5, 
    game_title: 'Practical Life: Menuang Air', 
    game_description: 'Urutkan langkah mencuci tangan yang benar.', 
    game_type: 'practical_life', 
    image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400', 
    min_score: 100,
    custom_items: [
      { step: 1, text: "Basahi tangan dengan air bersih", icon: "💧" },
      { step: 2, text: "Gunakan sabun secukupnya", icon: "🧼" },
      { step: 3, text: "Gosok sela-sela jari", icon: "👐" },
      { step: 4, text: "Bilas hingga bersih", icon: "✨" }
    ]
  }
];
