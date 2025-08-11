export interface Question {
  questionId: string;
  question: string;
  category: string;
  subCategory: string;
  level: 'easy' | 'medium' | 'hard';
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
}

export interface Answer {
  questionId: string;
  answer: string;
}


// export interface Result {
//   questions: ResultQuestion[],
//   score: number;
// }

// export interface ResultQuestion {
//   question: string;
//   selectedAnswer: string;
//   options: string[];
//   questionId: string;
//   correctAnswer: string;
//   isCorrectAnswer: boolean
// }