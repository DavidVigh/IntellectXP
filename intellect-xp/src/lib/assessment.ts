export type QuestionType =
  | "MATCH"
  | "DESCRIBE"
  | "TRUE_FALSE"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE";

export type QuestionAnswer = string | string[] | Record<string, string>;
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type AssessmentQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  pairs?: { left: string; right: string }[];
  correctAnswer: string | string[] | Record<string, string>;
  acceptedAnswers?: string[];
  explanation: string;
  points: number;
  difficulty: Difficulty;
  version: number;
};

export type QuestionAttempt = {
  id: string;
  questionId: string;
  answer: QuestionAnswer;
  isCorrect: boolean;
  pointsEarned: number;
  createdAt: string;
};

export type GradeResult = {
  isCorrect: boolean;
  pointsEarned: number;
  feedback: string;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function sameStringArray(left: string[], right: string[]) {
  return left.length === right.length && left.every((value) => right.includes(value));
}

export function gradeQuestion(question: AssessmentQuestion, answer: QuestionAnswer): GradeResult {
  let isCorrect = false;

  if (question.type === "MULTIPLE_CHOICE") {
    const submitted = Array.isArray(answer) ? answer.filter((value): value is string => typeof value === "string") : [answer].filter((value): value is string => typeof value === "string");
    const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer.filter((value): value is string => typeof value === "string") : [question.correctAnswer].filter((value): value is string => typeof value === "string");
    isCorrect = sameStringArray(submitted, expected);
  } else if (question.type === "MATCH") {
    const submitted = typeof answer === "object" && !Array.isArray(answer) ? answer : {};
    const expected = typeof question.correctAnswer === "object" && !Array.isArray(question.correctAnswer) ? question.correctAnswer : {};
    isCorrect = Object.entries(expected).every(([key, value]) => submitted[key] === value);
  } else {
    const submitted = typeof answer === "string" ? normalizeText(answer) : "";
    const expectedValues = question.acceptedAnswers ?? (typeof question.correctAnswer === "string" ? [question.correctAnswer] : []);
    isCorrect = expectedValues.some((expected) => submitted === normalizeText(expected) || (question.type === "DESCRIBE" && submitted.includes(normalizeText(expected))));
  }

  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    feedback: isCorrect ? question.explanation : `Not quite. ${question.explanation}`,
  };
}

export function xpForQuestion(question: AssessmentQuestion, isCorrect: boolean) {
  if (!isCorrect) return 0;
  const multiplier = question.difficulty === "HARD" ? 1.5 : question.difficulty === "MEDIUM" ? 1.2 : 1;
  return Math.round(question.points * multiplier);
}

export function createXpIdempotencyKey(userId: string, sourceType: "MILESTONE_TEST" | "DAILY_CHALLENGE", sourceId: string, questionId: string) {
  return `${userId}:${sourceType}:${sourceId}:${questionId}:v${1}`;
}
