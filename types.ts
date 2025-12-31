
export type UserType = 'superadmin' | 'admin' | 'director' | 'teacher' | 'parent';

export interface User {
  user_id: number;
  username: string;
  email: string;
  user_type: UserType;
  full_name: string;
  phone?: string;
  profile_picture?: string;
}

export interface Student {
  student_id: number;
  nis: string;
  full_name: string;
  birth_date: string;
  birth_place: string;
  gender: 'Laki-laki' | 'Perempuan';
  photo?: string;
  status: 'Active' | 'Graduated' | 'Moved' | 'Inactive';
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  quiz_id: number;
  quiz_title: string;
  quiz_type: 'game' | 'multiple_choice' | 'observation';
  start_date: string;
  end_date: string;
  passing_score: number;
  questions?: Question[];
}

export interface QuizResult {
  result_id: number;
  quiz_id: number;
  student_id: number;
  score: number;
  completed_at: string;
  status: 'Pass' | 'Fail';
}

export interface Class {
  class_id: number;
  class_name: string;
  class_level: 'Playgroup' | 'TK A' | 'TK B';
  academic_year: string;
  current_students: number;
  max_students: number;
}

export interface LearningArea {
  area_id: number;
  area_name: string;
  color_code: string;
  icon: string;
  description?: string;
}

export interface Competency {
  competency_id: number;
  area_id: number;
  competency_code: string;
  competency_desc: string;
  indicator: string;
}

export interface DailyActivity {
  activity_id: number;
  title: string;
  content: string;
  activity_date: string;
  area_id: number;
  photos?: string[];
  is_published: boolean;
  student_id?: number; 
}

export interface ElearningModule {
  module_id: number;
  module_title: string;
  module_description: string;
  class_level: string;
  area_id: number;
  content_type: 'video' | 'document' | 'interactive' | 'quiz';
  content_url: string;
  duration_minutes: number;
  is_live_stream?: boolean;
  linked_quiz_id?: number;
}

export interface LearningGame {
  game_id: number;
  game_title: string;
  game_description: string;
  game_type: 'memory' | 'sorting' | 'bead_stair' | 'golden_beads' | 'practical_life' | 'stamp_game' | 'snake_game';
  image_url: string;
  min_score: number;
  categories?: string[];
  custom_items?: any[];
}
