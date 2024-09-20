// src/types.ts
export interface QuizResult {
    id: number;
    student: string;
    quiz: string;
    score: number;
    date_taken: string;
    questions: AnswerSubmission[];
  }
  
  export interface AnswerSubmission {
    id: number;
    quiz: string;
    student: string;
    question: string;
    option: string;
    is_correct: boolean;
    status: string;
  }
  
  export interface LeaderboardEntry {
    id: number;
    student: string;
    total_score: number;
    last_updated: string;
  }