export interface QuestionOption {
  text: string;
  type: 'optimizer' | 'harmonizer' | 'planner' | 'innovator';
  weight: number;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface Answer {
  type: 'optimizer' | 'harmonizer' | 'planner' | 'innovator';
  weight: number;
}

export interface ResultTraits {
  behavioral: string;
  emotional: string;
}

export interface TestResult {
  title: string;
  subtitle: string;
  theory: string;
  time_philosophy: string;
  traits: ResultTraits;
  strength: string;
  weakness: string;
  share_text: string;
  recommended_kit: string;
}

export type ResultType = 'optimizer' | 'harmonizer' | 'planner' | 'innovator';

export function calculateResult(answers: Answer[]): ResultType {
  const scores: Record<ResultType, number> = {
    optimizer: 0,
    harmonizer: 0,
    planner: 0,
    innovator: 0
  };

  answers.forEach(answer => {
    scores[answer.type] += answer.weight;
  });

  const result = (Object.keys(scores) as ResultType[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return result;
}


